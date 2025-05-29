'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Order } from '@/types';
import { pdf } from '@react-pdf/renderer';
import OrderReceipt from './order-receipt';
import React from 'react';

interface DownloadReceiptButtonProps {
  order: Omit<Order, "paymentResult">;
  dict: any;
  title: string;
}

export default function DownloadReceiptButton({ order, dict, title }: DownloadReceiptButtonProps) {
  const handleDownload = async () => {
    try {
      // Generate PDF blob
      const blob = await pdf(
        <OrderReceipt order={order} dict={dict} />
      ).toBlob();

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
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  };

  return (
    <Button 
      onClick={handleDownload}
      className="w-full bg-[#FF7A3D]/10 hover:bg-[#FF7A3D]/20 text-[#FF7A3D] border border-[#FF7A3D]/20 hover:border-[#FF7A3D]/30 transition-all duration-200"
    >
      <Download className="h-4 w-4 mr-2" />
      {title}
    </Button>
  );
} 