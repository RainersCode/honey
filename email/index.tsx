import { Resend } from 'resend';
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants';
import { Order } from '@/types';
import dotenv from 'dotenv';
import { generateReceipt } from '@/lib/utils/generate-receipt';
import { getDictionary } from '@/lib/dictionary';
dotenv.config();

import PurchaseReceiptEmail from './purchase-receipt';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  console.log('📧 Starting to send purchase receipt email for order:', {
    orderId: order.id,
    userFacingId: order.userFacingId,
    userEmail: order.user.email,
    userName: order.user.name,
  });

  try {
    // Get dictionary for the receipt
    const dict = await getDictionary('en');
    console.log('✅ Dictionary loaded successfully');

    // Generate PDF receipt
    console.log('🔄 Generating PDF receipt...');
    const pdfBlob = await generateReceipt(order, dict);

    if (!pdfBlob) {
      console.error('❌ Failed to generate PDF receipt');
      return;
    }
    console.log('✅ PDF receipt generated successfully');

    // Convert blob to buffer for email attachment
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());
    console.log('✅ PDF converted to buffer, size:', buffer.length, 'bytes');

    console.log('🚀 Sending email with Resend...', {
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: order.user.email,
      subject: `Order Confirmation ${order.userFacingId}`,
      attachmentSize: buffer.length,
    });

    const result = await resend.emails.send({
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: order.user.email,
      subject: `Order Confirmation ${order.userFacingId}`,
      react: <PurchaseReceiptEmail order={order} />,
      attachments: [
        {
          filename: `order-${order.userFacingId}.pdf`,
          content: buffer,
        },
      ],
    });

    console.log('✅ Email sent successfully:', {
      messageId: result.data?.id,
      orderId: order.id,
      userFacingId: order.userFacingId,
      recipientEmail: order.user.email,
    });

    return result;
  } catch (error) {
    console.error('❌ Error sending purchase receipt email:', {
      error: error,
      orderId: order.id,
      userEmail: order.user.email,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
