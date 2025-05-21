import { z } from 'zod';
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
  insertReviewSchema,
} from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = {
  fullName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  deliveryMethod: 'home' | 'omniva';
  omnivaLocationId?: string;
  omnivaLocationDetails?: {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    type: string;
  };
  agreeToTerms: boolean;
  agreeToPrivacyPolicy: boolean;
  rememberDetails?: boolean;
  lat?: number;
  lng?: number;
};
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: Boolean;
  paidAt: Date | null;
  isShipped: Boolean;
  shippedAt: Date | null;
  isDelivered: Boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};
