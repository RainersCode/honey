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
  // Get dictionary for the receipt
  const dict = await getDictionary('en');
  
  // Generate PDF receipt
  const pdfBlob = await generateReceipt(order, dict);
  
  if (!pdfBlob) {
    console.error('Failed to generate PDF receipt');
    return;
  }

  // Convert blob to buffer for email attachment
  const buffer = Buffer.from(await pdfBlob.arrayBuffer());

  await resend.emails.send({
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
};
