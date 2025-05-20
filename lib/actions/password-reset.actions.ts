'use server';

import { prisma } from '@/db/prisma';
import { hash } from '../encrypt';
import { formatError } from '../utils';
import { z } from 'zod';
import { Resend } from 'resend';
import { ResetPasswordEmail } from '@/email/reset-password-email';
import { SENDER_EMAIL, APP_NAME, SERVER_URL } from '@/lib/constants';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

// Schema for requesting password reset
const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Schema for resetting password
const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Request password reset
export async function requestPasswordReset(prevState: unknown, formData: FormData) {
  try {
    const { email } = requestResetSchema.parse({
      email: formData.get('email'),
    });

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token and expiry to user
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send reset password email
    const resetUrl = `${SERVER_URL}/reset-password/${resetToken}`;
    
    try {
      console.log('Attempting to send password reset email with config:', {
        from: `${APP_NAME} <${SENDER_EMAIL}>`,
        to: email,
        subject: `Reset Your ${APP_NAME} Password`,
        appUrl: SERVER_URL,
        resetToken,
      });

      const emailResponse = await resend.emails.send({
        from: `${APP_NAME} <${SENDER_EMAIL}>`,
        to: email,
        subject: `Reset Your ${APP_NAME} Password`,
        react: ResetPasswordEmail({ resetUrl }),
      });

      console.log('Password reset email sent successfully:', emailResponse);

      return { success: true, message: 'Password reset instructions sent to your email' };
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      
      // Clear the reset token since email failed
      await prisma.user.update({
        where: { email },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return { 
        success: false, 
        message: 'Failed to send reset email. Please try again later or contact support.' 
      };
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: formatError(error) };
  }
}

// Reset password with token
export async function resetPassword(prevState: unknown, formData: FormData) {
  try {
    const data = resetPasswordSchema.parse({
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      token: formData.get('token'),
    });

    // Find user by reset token and check if token is not expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: data.token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return { success: false, message: 'Invalid or expired reset token' };
    }

    // Hash new password
    const hashedPassword = await hash(data.password);

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: formatError(error) };
  }
} 