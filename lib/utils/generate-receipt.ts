import React from 'react';
import { Order } from '@/types';
import { pdf } from '@react-pdf/renderer';
import OrderReceipt from '@/components/shared/order-receipt';

export const generateReceipt = async (order: Order, dict: any, forDownload = false) => {
  try {
    // Generate PDF blob
    const blob = await pdf(
      React.createElement(OrderReceipt, { order, dict })
    ).toBlob();

    if (forDownload) {
      // Create URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `order-${order.userFacingId}.pdf`;

      // Append link to document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);

      return true;
    }

    return blob;
  } catch (error) {
    console.error('Error generating receipt:', error);
    return false;
  }
};