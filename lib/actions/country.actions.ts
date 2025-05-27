'use server';

import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

interface AddCountryInput {
  name: string;
  code: string;
  flag: string;
}

interface UpdateCountryInput {
  name?: string;
  code?: string;
  flag?: string;
  isActive?: boolean;
}

export async function addCountry(data: AddCountryInput) {
  try {
    const country = await prisma.country.create({
      data: {
        name: data.name,
        code: data.code.toUpperCase(),
        flag: data.flag,
        isActive: true,
      },
    });

    revalidatePath('/admin/countries');
    return {
      success: true,
      country,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.code === 'P2002'
          ? 'A country with this name or code already exists'
          : 'Failed to add country',
    };
  }
}

export async function updateCountry(id: string, data: UpdateCountryInput) {
  try {
    const country = await prisma.country.update({
      where: { id },
      data,
    });

    revalidatePath('/admin/countries');
    return {
      success: true,
      country,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update country',
    };
  }
}

export async function deleteCountry(id: string) {
  try {
    const country = await prisma.country.delete({
      where: { id },
    });

    revalidatePath('/admin/countries');
    return {
      success: true,
      country,
    };
  } catch (error) {
    console.error('Error deleting country:', error);
    return {
      success: false,
      message: 'Failed to delete country',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getActiveCountries() {
  try {
    const countries = await prisma.country.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      success: true,
      countries,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch countries',
    };
  }
}
