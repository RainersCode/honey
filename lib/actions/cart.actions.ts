'use server';

import { cookies } from 'next/headers';
import { CartItem } from '@/types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { DELIVERY_METHODS, INTERNATIONAL_SHIPPING_RATES } from '../constants';
import { dict } from '../dict';
import { getDictionary } from '@/lib/dictionary';

// Calculate total weight of items in cart
const calculateTotalWeight = (items: CartItem[]) => {
  return items.reduce((sum, item) => {
    const itemWeight = parseFloat(item.weight?.toString() || '0');
    const itemQty = parseInt(item.qty.toString());
    return sum + itemWeight * itemQty;
  }, 0);
};

// Calculate shipping price based on weight and delivery method
const calculateShippingPrice = async (
  weight: number,
  deliveryMethod: string = 'international'
) => {
  // Find applicable shipping rule
  const rule = await prisma.shippingRule.findFirst({
    where: {
      zone: deliveryMethod,
      minWeight: {
        lte: weight,
      },
      maxWeight: {
        gte: weight,
      },
    },
    orderBy: {
      price: 'asc', // Get the cheapest applicable rule
    },
  });

  // If no rule found, use default rates
  if (!rule) {
    if (deliveryMethod === DELIVERY_METHODS.INTERNATIONAL) {
      if (weight <= INTERNATIONAL_SHIPPING_RATES.LIGHT.maxWeight) {
        return INTERNATIONAL_SHIPPING_RATES.LIGHT.price;
      } else if (weight <= INTERNATIONAL_SHIPPING_RATES.MEDIUM.maxWeight) {
        return INTERNATIONAL_SHIPPING_RATES.MEDIUM.price;
      } else {
        const extraWeight = Math.ceil(
          weight - INTERNATIONAL_SHIPPING_RATES.MEDIUM.maxWeight
        );
        return INTERNATIONAL_SHIPPING_RATES.MEDIUM.price + extraWeight * 2;
      }
    } else if (deliveryMethod === DELIVERY_METHODS.OMNIVA) {
      return 3.1; // Default Omniva price
    }
  }

  return rule ? Number(rule.price) : 0;
};

// Calculate cart prices
const calcPrice = async (
  items: CartItem[],
  deliveryMethod: string = 'international'
) => {
  const itemsPrice = items.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price.toString());
    const itemQty = parseInt(item.qty.toString());
    return sum + itemPrice * itemQty;
  }, 0);

  // Calculate total weight and shipping price
  const totalWeight = calculateTotalWeight(items);
  const shippingPrice = await calculateShippingPrice(
    totalWeight,
    deliveryMethod
  );

  // Calculate tax price (21%)
  const taxPrice = round2(itemsPrice * 0.21);

  // Calculate total price with rounded values
  const roundedItemsPrice = round2(itemsPrice);
  const roundedShippingPrice = round2(shippingPrice);
  const totalPrice = round2(
    roundedItemsPrice + roundedShippingPrice + taxPrice
  );

  return {
    itemsPrice: roundedItemsPrice,
    shippingPrice: roundedShippingPrice,
    taxPrice,
    totalPrice,
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // Get dictionary
    const dict = await getDictionary('en'); // Default to English for server-side messages

    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error('Product not found');

    // Add weight to item
    item.weight = product.weight || 0;

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item], 'international'),
        deliveryMethod: 'international',
      });

      // Add to database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      // Dispatch cart update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdate'));
      }

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error(
            `${dict.cart.stockLimit.exceeded.replace('{stock}', product.stock.toString())}`
          );
        }

        // Increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // If item does not exist in cart
        // Check stock
        if (product.stock < 1) throw new Error(dict.cart.stockLimit.error);

        // Add item to the cart.items
        cart.items.push(item);
      }

      // Get current delivery method
      const currentDeliveryMethod = cart.deliveryMethod || 'international';

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[], currentDeliveryMethod),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      // Dispatch cart update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdate'));
      }

      return {
        success: true,
        message: `${product.name} ${
          existItem ? 'updated in' : 'added to'
        } cart`,
      };
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to add item to cart',
    };
  }
}

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get Product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error('Product not found');

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    // Check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error('Item not found');

    // Check if only one in qty
    if (exist.qty === 1) {
      // Remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      // Decrease qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }

    // Get current delivery method and calculate prices accordingly
    const currentDeliveryMethod = cart.deliveryMethod || 'international';

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[], currentDeliveryMethod),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    // Dispatch cart update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdate'));
    }

    return {
      success: true,
      message: 'Item removed from cart successfully',
    };
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return {
      success: false,
      message: 'Failed to remove item from cart',
    };
  }
}

export async function updateCartDeliveryMethod(
  deliveryMethod: 'international' | 'omniva'
) {
  try {
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    // Calculate new prices based on delivery method
    const newPrices = await calcPrice(cart.items as CartItem[], deliveryMethod);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        deliveryMethod,
        itemsPrice: newPrices.itemsPrice,
        shippingPrice: newPrices.shippingPrice,
        taxPrice: newPrices.taxPrice,
        totalPrice: newPrices.totalPrice,
      },
    });

    revalidatePath('/cart');
    revalidatePath('/place-order');

    return {
      success: true,
      message: 'Delivery method updated',
      prices: newPrices,
    };
  } catch (error) {
    console.error('Error updating delivery method:', error);
    return {
      success: false,
      message: 'Failed to update delivery method',
    };
  }
}

export async function getShippingRules(weight: number, deliveryMethod: string) {
  try {
    // Find applicable shipping rule
    const rule = await prisma.shippingRule.findFirst({
      where: {
        zone: deliveryMethod,
        minWeight: {
          lte: weight,
        },
        maxWeight: {
          gte: weight,
        },
      },
      orderBy: {
        price: 'asc',
      },
    });

    // Get all rules for this delivery method for display
    const allRules = await prisma.shippingRule.findMany({
      where: {
        zone: deliveryMethod,
      },
      orderBy: {
        minWeight: 'asc',
      },
    });

    return {
      success: true,
      currentRule: rule,
      allRules,
    };
  } catch (error) {
    console.error('Error getting shipping rules:', error);
    return {
      success: false,
      message: 'Failed to get shipping rules',
    };
  }
}
