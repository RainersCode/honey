'use server';

import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schema for shipping rule
const shippingRuleSchema = z
  .object({
    zone: z.string().min(1, 'Zone is required'),
    minWeight: z.number().min(0, 'Minimum weight must be 0 or greater'),
    maxWeight: z.number().min(0, 'Maximum weight must be 0 or greater'),
    price: z.number().min(0, 'Price must be 0 or greater'),
    carrier: z.string().default('standard'),
  })
  .refine((data) => data.maxWeight > data.minWeight, {
    message: 'Maximum weight must be greater than minimum weight',
    path: ['maxWeight'],
  });

// Get all shipping rules
export async function getAllShippingRules(params: {
  page?: number;
  zone?: string;
}) {
  const { page = 1, zone } = params;
  const take = 10;
  const skip = (page - 1) * take;

  const where = zone ? { zone } : {};

  const [rules, count] = await Promise.all([
    prisma.shippingRule.findMany({
      where,
      orderBy: [{ zone: 'asc' }, { minWeight: 'asc' }],
      skip,
      take,
    }),
    prisma.shippingRule.count({ where }),
  ]);

  return {
    data: rules,
    totalPages: Math.ceil(count / take),
  };
}

// Get shipping rule by ID
export async function getShippingRuleById(id: string) {
  return prisma.shippingRule.findUnique({
    where: { id },
  });
}

// Create shipping rule
export async function createShippingRule(
  data: z.infer<typeof shippingRuleSchema>
) {
  try {
    const validatedData = shippingRuleSchema.parse(data);

    const rule = await prisma.shippingRule.create({
      data: validatedData,
    });

    revalidatePath('/admin/shipping');
    return { success: true, data: rule };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to create shipping rule' };
  }
}

// Update shipping rule
export async function updateShippingRule(
  id: string,
  data: z.infer<typeof shippingRuleSchema>
) {
  try {
    const validatedData = shippingRuleSchema.parse(data);

    const rule = await prisma.shippingRule.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath('/admin/shipping');
    return { success: true, data: rule };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to update shipping rule' };
  }
}

// Delete shipping rule
export async function deleteShippingRule(id: string) {
  try {
    await prisma.shippingRule.delete({
      where: { id },
    });

    revalidatePath('/admin/shipping');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete shipping rule' };
  }
}
