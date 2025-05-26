import React from 'react';
import { Order } from '@/types';
import { pdf } from '@react-pdf/renderer';
import OrderReceipt from '@/components/shared/order-receipt';

export const generateReceipt = async (order: Order, dict: any) => {
  try {
    // Generate PDF blob
    const blob = await pdf(
      React.createElement(OrderReceipt, { order, dict })
    ).toBlob();

    return blob;
  } catch (error) {
    console.error('Error generating receipt:', error);
    return false;
  }
};