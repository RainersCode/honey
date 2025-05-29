'use server';

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
  updateUserSchema,
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hash } from '../encrypt';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { ShippingAddress } from '@/types';
import { z } from 'zod';
import { PAGE_SIZE } from '../constants/index';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { getMyCart } from './cart.actions';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import { VerifyEmail } from '@/email/verify-email';
import { SENDER_EMAIL, APP_NAME, SERVER_URL } from '@/lib/constants';
import dotenv from 'dotenv';
import { redirect } from 'next/navigation';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Invalid email or password' };
  }
}

// Sign user out
export async function signOutUser() {
  // get current users cart and delete it so it does not persist to next user
  const currentCart = await getMyCart();

  if (currentCart?.id) {
    await prisma.cart.delete({ where: { id: currentCart.id } });
  } else {
    console.warn('No cart found for deletion.');
  }

  // Get the current language from the URL
  const headersList = await headers();
  const url = new URL(headersList.get('referer') || '');
  const lang = url.pathname.split('/')[1] || 'en';

  // Sign out and redirect to home page
  await signOut({ redirectTo: `/${lang}` });
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  let newUserId: string | null = null;
  
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return { success: false, message: 'User already exists with this email' };
      } else {
        // User exists but email not verified - resend verification email
        const verificationToken = crypto.randomUUID();
        const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.user.update({
          where: { email: user.email },
          data: {
            verificationToken,
            verificationExpiry,
          },
        });

        const verificationUrl = `${SERVER_URL}/verify-email/${verificationToken}`;

        // Send verification email
        await resend.emails.send({
          from: `${APP_NAME} <${SENDER_EMAIL}>`,
          to: user.email,
          subject: `Welcome to ${APP_NAME} - Verify your email`,
          react: VerifyEmail({ verificationUrl, userName: existingUser.name }),
        });

        // Get current language from headers
        const headersList = await headers();
        const referer = headersList.get('referer') || '';
        const url = new URL(referer);
        const lang = url.pathname.split('/')[1] || 'en';

        redirect(`/${lang}/registration-success?email=${encodeURIComponent(user.email)}`);
      }
    }

    // Hash password
    const hashedPassword = await hash(user.password);

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with unverified email
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        verificationToken,
        verificationExpiry,
      },
    });

    // Store the user ID for cleanup if needed
    newUserId = newUser.id;

    // Send verification email
    const verificationUrl = `${SERVER_URL}/verify-email/${verificationToken}`;
    
    await resend.emails.send({
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: user.email,
      subject: `Welcome to ${APP_NAME} - Verify your email`,
      react: VerifyEmail({ verificationUrl, userName: user.name }),
    });

    // Get current language from headers
    const headersList = await headers();
    const referer = headersList.get('referer') || '';
    const url = new URL(referer);
    const lang = url.pathname.split('/')[1] || 'en';

    redirect(`/${lang}/registration-success?email=${encodeURIComponent(user.email)}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    
    // If we created a new user but email failed, clean up
    if (newUserId) {
      try {
        await prisma.user.delete({
          where: { id: newUserId },
        });
      } catch (deleteError) {
        console.error('Failed to cleanup user after email error:', deleteError);
      }
    }
    
    // Handle email sending errors
    console.error('Signup error:', error);
    return { 
      success: false, 
      message: 'Failed to send verification email. Please try again later.' 
    };
  }
}

// Get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error('User not found');
  return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update the user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Verify email address
export async function verifyEmail(token: string) {
  try {
    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return { success: false, message: 'Invalid verification token' };
    }

    // Check if token has expired
    if (!user.verificationExpiry || user.verificationExpiry < new Date()) {
      return { success: false, message: 'Verification token has expired' };
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return { success: false, message: 'Email is already verified' };
    }

    // Verify the email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationExpiry: null,
      },
    });

    return { 
      success: true, 
      message: 'Email verified successfully! You can now sign in to your account.',
      email: user.email
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return { success: false, message: formatError(error) };
  }
}

// Resend verification email
export async function resendVerificationEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.emailVerified) {
      return { success: false, message: 'Email is already verified' };
    }

    // Generate new verification token
    const verificationToken = crypto.randomUUID();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { email },
      data: {
        verificationToken,
        verificationExpiry,
      },
    });

    // Send verification email
    const verificationUrl = `${SERVER_URL}/verify-email/${verificationToken}`;
    
    try {
      await resend.emails.send({
        from: `${APP_NAME} <${SENDER_EMAIL}>`,
        to: email,
        subject: `Welcome to ${APP_NAME} - Verify your email`,
        react: VerifyEmail({ verificationUrl, userName: user.name }),
      });

      return { 
        success: true, 
        message: 'Verification email sent. Please check your email.' 
      };
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return { 
        success: false, 
        message: 'Failed to send verification email. Please try again later.' 
      };
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    return { success: false, message: formatError(error) };
  }
}

// Resend verification email (form action)
export async function resendVerificationEmailAction(prevState: unknown, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    
    if (!email) {
      return { success: false, message: 'Email is required' };
    }

    const result = await resendVerificationEmail(email);
    return result;
  } catch (error) {
    console.error('Resend verification action error:', error);
    return { success: false, message: formatError(error) };
  }
}
