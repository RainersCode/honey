import { NextResponse } from 'next/server';
import client from '@/lib/config/easypost';

export async function POST(request: Request) {
  try {
    const { toAddress, weight } = await request.json();

    // Create the shipment with EasyPost
    const shipment = await client.Shipment.create({
      from_address: {
        company: process.env.EASYPOST_FROM_COMPANY,
        street1: process.env.EASYPOST_FROM_STREET,
        city: process.env.EASYPOST_FROM_CITY,
        state: process.env.EASYPOST_FROM_STATE,
        zip: process.env.EASYPOST_FROM_ZIP,
        country: process.env.EASYPOST_FROM_COUNTRY,
        phone: process.env.EASYPOST_FROM_PHONE,
      },
      to_address: {
        zip: toAddress.zip,
        country: toAddress.country,
      },
      parcel: {
        weight: weight,
      },
    });

    // Format the rates for the frontend
    const rates = shipment.rates.map((rate: any) => ({
      service: rate.service,
      rate: parseFloat(rate.rate),
      carrier: rate.carrier,
      delivery_days: rate.delivery_days,
    }));

    // Sort rates by price
    rates.sort((a: any, b: any) => a.rate - b.rate);

    return NextResponse.json({ rates });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    return NextResponse.json(
      { message: 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
} 