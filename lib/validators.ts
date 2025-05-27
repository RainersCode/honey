import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';
import { PAYMENT_METHODS, DELIVERY_METHODS } from './constants';
import { getActiveCountries } from './actions/country.actions';

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly two decimal places'
  );

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters'),
  brand: z.string().min(3, 'Brand must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'Product must have at least one image'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
  weight: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => {
      if (val === '') return null;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? null : num;
    }),
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, 'Id is required'),
});

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for signing up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.union([z.string(), z.number()]),
  image: z.string().optional(),
  qty: z.number().min(1, 'Quantity must be at least 1'),
  slug: z.string().min(1, 'Product slug is required'),
  weight: z.any().transform((val) => {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'object') {
      // If it's a Decimal object from Prisma
      if (val.toString) return parseFloat(val.toString());
      return 0;
    }
    const num = typeof val === 'string' ? parseFloat(val) : Number(val);
    return isNaN(num) ? 0 : num;
  }),
});

// Create a price schema that accepts both string and number
const priceSchema = z.union([z.string(), z.number()]);

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: priceSchema,
  totalPrice: priceSchema,
  shippingPrice: priceSchema,
  taxPrice: priceSchema,
  sessionCartId: z.string().min(1, 'Session cart id is required'),
  userId: z.string().optional().nullable(),
  deliveryMethod: z.enum(['international', 'omniva']).default('international'),
});

// Schema for the shipping address
export const shippingAddressSchema = z
  .object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
    city: z.string().min(3, 'City must be at least 3 characters'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
    country: z
      .string()
      .min(2, 'Country code must be 2 characters')
      .max(2, 'Country code must be 2 characters')
      .default('LV'),
    phoneNumber: z
      .string()
      .min(5, 'Phone number is required')
      .regex(/^[+]?[\d\s-()]+$/, 'Invalid phone number format'),
    deliveryMethod: z.enum(['international', 'omniva'], {
      required_error: 'Please select a delivery method',
    }),
    omnivaLocationId: z.string().optional(),
    omnivaLocationDetails: z
      .object({
        id: z.string(),
        name: z.string(),
        address: z.string(),
        city: z.string(),
        country: z.string(),
        type: z.string(),
      })
      .nullable()
      .optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
    agreeToPrivacyPolicy: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the privacy policy',
    }),
    rememberDetails: z.boolean().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  })
  .refine(
    (data) => {
      // If delivery method is Omniva, require Omniva location
      if (data.deliveryMethod === 'omniva') {
        return !!(data.omnivaLocationId && data.omnivaLocationDetails);
      }
      return true;
    },
    {
      message: 'Please select an Omniva pickup location from the list',
      path: ['omnivaLocationDetails'],
    }
  )
  .refine(
    (data) => {
      // If delivery method is Omniva, country must be Latvia (LV)
      if (data.deliveryMethod === 'omniva') {
        return data.country === 'LV';
      }
      return true;
    },
    {
      message: 'Omniva delivery is only available in Latvia',
      path: ['country'],
    }
  )
  .transform((data) => {
    // If Omniva delivery is selected, force country to be Latvia
    if (data.deliveryMethod === 'omniva') {
      return { ...data, country: 'LV' };
    }
    return data;
  });

// Schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'Payment method is required'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
  });

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: 'Invalid payment method',
  }),
  shippingAddress: shippingAddressSchema,
});

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

// Schema for the PayPal paymentResult
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at leaast 3 characters'),
  email: z.string().min(3, 'Email must be at leaast 3 characters'),
});

// Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, 'ID is required'),
  role: z.string().min(1, 'Role is required'),
});

// Schema to insert reviews
export const insertReviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  productId: z.string().min(1, 'Product is required'),
  userId: z.string().min(1, 'User is required'),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
});
