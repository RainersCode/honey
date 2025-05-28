'use server';
import { prismaSingleton as prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants/index';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validators';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Get latest products
export async function getLatestProducts() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: {
        select: {
          id: true,
          key: true,
          name: true,
          description: true,
          image: true
        }
      }
    }
  });

  return convertToPlainObject(products);
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          id: true,
          key: true,
          name: true,
          description: true,
          image: true
        }
      }
    }
  });

  return product ? convertToPlainObject(product) : null;
}

// Get single product by it's ID
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          key: true,
          name: true,
          description: true,
          image: true
        }
      }
    }
  });

  return product ? convertToPlainObject(product) : null;
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== 'all' 
    ? { 
        category: {
          key: category
        } 
      } 
    : {};

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    include: {
      category: {
        select: {
          id: true,
          key: true,
          name: true,
          description: true,
          image: true
        }
      }
    },
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const plainData = convertToPlainObject(data);

  const dataCount = await prisma.product.count({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
  });

  return {
    data: plainData,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a product
export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
  return product;
}

// Create a product
export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        brand: data.brand,
        description: data.description,
        images: data.images,
        stock: data.stock,
        price: data.price,
        weight: data.weight,
        isFeatured: data.isFeatured || false,
        banner: data.banner || null,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true, message: 'Product created successfully' };
  } catch (error) {
    console.error('Error creating product:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to create product' 
    };
  }
}

// Update a product
export async function updateProduct(id: string, data: any) {
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      categoryId: data.categoryId,
      brand: data.brand,
      description: data.description,
      images: data.images,
      stock: data.stock,
      price: data.price,
      weight: data.weight,
      isFeatured: data.isFeatured,
      banner: data.banner,
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
  return product;
}

// Get featured products
export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    include: {
      category: {
        select: {
          id: true,
          key: true,
          name: true,
          description: true,
          image: true
        }
      }
    }
  });

  return convertToPlainObject(products);
}
