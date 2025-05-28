'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants';
import ContactFormEmail from '@/email/contact-form-email';
import { formatError } from '../utils';

const resend = new Resend(process.env.RESEND_API_KEY as string);

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export async function sendContactForm(data: ContactFormData) {
  try {
    // Validate the form data
    const validatedData = contactFormSchema.parse(data);

    // Get the recipient email (you can configure this in environment variables)
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.SENDER_EMAIL || 'contact@honeyfarm.com';

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: `${APP_NAME} Contact Form <${SENDER_EMAIL}>`,
      to: recipientEmail,
      replyTo: validatedData.email,
      subject: `Contact Form: ${validatedData.subject}`,
      react: ContactFormEmail({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      }),
    });

    console.log('Contact form email sent successfully:', emailResponse);

    return { 
      success: true, 
      message: 'Your message has been sent successfully. We\'ll get back to you soon!' 
    };
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: 'Please check your form data and try again.' 
      };
    }

    return { 
      success: false, 
      message: 'Failed to send message. Please try again later or contact us directly.' 
    };
  }
} 