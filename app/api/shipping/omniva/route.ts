import { NextResponse } from 'next/server';

const OMNIVA_API_URL = 'https://www.omniva.ee/locations.json';

export async function GET() {
  try {
    const response = await fetch(OMNIVA_API_URL);
    const locations = await response.json();

    // Filter for Latvia locations and format the data
    const latvianLocations = locations
      .filter((location: any) => location.A0_NAME === 'LV')
      .map((location: any) => ({
        id: location.ZIP,
        name: location.NAME,
        address: `${location.A2_NAME}, ${location.A5_NAME}, ${location.A7_NAME}`,
        city: location.A2_NAME,
        country: 'Latvia',
        type: 'Omniva Parcel Machine',
      }));

    return NextResponse.json(latvianLocations);
  } catch (error) {
    console.error('Error fetching Omniva locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Omniva locations' },
      { status: 500 }
    );
  }
} 