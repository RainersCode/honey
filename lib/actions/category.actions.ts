'use server';

import { prismaSingleton as prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

// Get all categories
export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return categories;
}

// Get category by ID
export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return category;
}

// Create category
export async function createCategory(data: {
  key: string;
  name: string;
  description: string;
  image: string;
}) {
  try {
    const category = await prisma.category.create({
      data
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true, data: category };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create category' };
  }
}

// Update category
export async function updateCategory(data: {
  id: string;
  key: string;
  name: string;
  description: string;
  image: string;
}) {
  try {
    const { id, ...updateData } = data;
    const category = await prisma.category.update({
      where: { id },
      data: updateData
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true, data: category };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update category' };
  }
}

// Delete category
export async function deleteCategory(id: string) {
  try {
    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (category?._count.products && category._count.products > 0) {
      return { success: false, error: 'Cannot delete category with existing products' };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete category' };
  }
} 