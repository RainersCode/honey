import { CartItem } from '@/types';
import { prisma } from '@/db/prisma';
import { round2 } from './utils';
import { DELIVERY_METHODS, INTERNATIONAL_SHIPPING_RATES } from './constants/index';

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
export const calcPrice = async (
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
