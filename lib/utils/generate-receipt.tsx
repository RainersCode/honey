import React from 'react';
import { Order } from '@/types';
import { pdf } from '@react-pdf/renderer';
import OrderReceipt from '@/components/shared/order-receipt';

export const generateReceipt = async (order: Omit<Order, "paymentResult">, dict: any) => {
  try {
    // Generate PDF blob
    const blob = await pdf(
      <OrderReceipt order={order} dict={dict} />
    ).toBlob();

    return blob;
  } catch (error) {
    console.error('Error generating receipt:', error);
    return false;
  }
};