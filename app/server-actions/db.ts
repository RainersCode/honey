'use server';

import { prisma } from '@/db/prisma';

export async function getUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: { email },
  });
}

export async function updateUserCart(userId: string, sessionCartId: string) {
  const sessionCart = await prisma.cart.findFirst({
    where: { sessionCartId },
  });

  if (sessionCart) {
    // Delete current user cart
    await prisma.cart.deleteMany({
      where: { userId },
    });

    // Assign new cart
    return prisma.cart.update({
      where: { id: sessionCart.id },
      data: { userId },
    });
  }
  return null;
}

export async function updateUserName(userId: string, name: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { name },
  });
} 