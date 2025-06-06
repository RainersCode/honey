'use server';

import { convertToPlainObject, formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { prisma } from '@/db/prisma';
import { CartItem, PaymentResult, ShippingAddress } from '@/types';
import { revalidatePath } from 'next/cache';
import { PAGE_SIZE } from '../constants/index';
import { Prisma } from '@prisma/client';
import { sendPurchaseReceipt } from '@/email';
import { insertOrderSchema } from '../validators';
import { format } from 'date-fns';
import { z } from 'zod';

// Define the input type for creating an order
type CreateOrderInput = z.infer<typeof insertOrderSchema>;

// Define the action response type
type ActionResponse = {
  success: boolean;
  message: string;
  redirectTo?: string;
};

// Create order and create the order items
export async function createOrder({
  userId,
  shippingAddress,
  paymentMethod,
  itemsPrice,
  shippingPrice,
  taxPrice,
  totalPrice,
}: CreateOrderInput): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');

    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty',
        redirectTo: '/cart',
      };
    }

    // Create order object
    const order = insertOrderSchema.parse({
      userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Generate user-facing ID in format: ORD-YYYYMMDD-XXXX
      const randomNum = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      const userFacingId = `ORD-${format(new Date(), 'yyyyMMdd')}-${randomNum}`;

      // Create order with user-facing ID
      const insertedOrder = await tx.order.create({
        data: {
          ...order,
          userFacingId,
        },
      });

      // Create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        const { productId, name, slug, image, price, qty } = item;
        await tx.orderItem.create({
          data: {
            productId,
            name,
            slug,
            image: image || '/placeholder-product.png',
            price,
            qty,
            orderId: insertedOrder.id,
          },
        });
      }
      // Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error('Order not created');

    return {
      success: true,
      message: 'Order created',
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
}

// Get user's orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error('User is not authorized');

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

// Get sales data and order summary
export async function getOrderSummary() {
  // Get counts for each resource
  const ordersCount = await prisma.order.count({
    where: { isPaid: true },
  });
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate the total sales from paid orders
  const totalSales = await prisma.order.aggregate({
    where: { isPaid: true },
    _sum: { totalPrice: true },
  });

  // Get monthly sales for the last 6 months from paid orders
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`
    WITH months AS (
      SELECT generate_series(
        date_trunc('month', NOW()) - interval '5 months',
        date_trunc('month', NOW()),
        interval '1 month'
      )::date as month
    )
    SELECT 
      to_char(months.month, 'Mon YY') as month,
      COALESCE(sum("totalPrice"), 0) as "totalSales"
    FROM months
    LEFT JOIN "Order" ON 
      date_trunc('month', "createdAt") = months.month
      AND "isPaid" = true
    GROUP BY months.month
    ORDER BY months.month ASC
  `;

  const salesData = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // Get latest paid sales
  const latestSales = await prisma.order.findMany({
    where: { isPaid: true },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

// Get all orders
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== 'all'
      ? {
          user: {
            name: {
              contains: query,
              mode: 'insensitive',
            } as Prisma.StringFilter,
          },
        }
      : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete an order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update COD order to paid
export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: 'Order marked as paid' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update COD order to delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');
    if (!order.isPaid) throw new Error('Order is not paid');

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Order has been marked delivered',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update order to shipped
export async function shipOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    // Update order to shipped
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isShipped: true,
        shippedAt: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Order has been marked as shipped',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  console.log('🔄 Starting updateOrderToPaid process:', {
    orderId,
    paymentResult,
  });

  // Get order from database
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  });

  if (!order) {
    console.error('❌ Order not found:', orderId);
    throw new Error('Order not found');
  }

  if (order.isPaid) {
    console.error('❌ Order is already paid:', orderId);
    throw new Error('Order is already paid');
  }

  console.log('✅ Order found, processing payment:', {
    orderId,
    isPaid: order.isPaid,
    orderItemsCount: order.orderitems.length,
  });

  // Transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  console.log('✅ Database transaction completed successfully');

  // Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) {
    console.error('❌ Updated order not found:', orderId);
    throw new Error('Order not found');
  }

  console.log('🚀 Calling sendPurchaseReceipt for order:', {
    orderId,
    userEmail: updatedOrder.user.email,
    userName: updatedOrder.user.name,
    userFacingId: updatedOrder.userFacingId,
  });

  try {
    await sendPurchaseReceipt({
      order: {
        ...updatedOrder,
        shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
        paymentResult: updatedOrder.paymentResult as PaymentResult,
      },
    });
    console.log('✅ sendPurchaseReceipt completed successfully');
  } catch (emailError) {
    console.error('❌ Error in sendPurchaseReceipt:', {
      error: emailError,
      orderId,
      userEmail: updatedOrder.user.email,
    });
    // Don't throw here - we don't want payment to fail if email fails
  }
}
