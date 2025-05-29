export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A modern ecommerce store built with Next.js';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: 'admin@example.com',
  password: '123456',
};

export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
  phoneNumber: '',
  deliveryMethod: 'international',
  omnivaLocationId: '',
  omnivaLocationDetails: null,
  agreeToTerms: false,
  agreeToPrivacyPolicy: false,
  rememberDetails: false,
};

export const PAYMENT_METHODS = ['Stripe'];
export const DEFAULT_PAYMENT_METHOD = 'Stripe';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
  name: '',
  slug: '',
  categoryId: '',
  brand: '',
  description: '',
  stock: 0,
  images: [],
  isFeatured: false,
  banner: null,
  price: '',
  weight: null,
  rating: '0',
  numReviews: '0',
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(', ')
  : ['admin', 'user'];

export const reviewFormDefaultValues = {
  title: '',
  description: '',
  rating: 5,
  productId: '',
  userId: '',
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

export const forgotPasswordDefaultValues = {
  email: '',
};

export const DELIVERY_METHODS = {
  INTERNATIONAL: 'international',
  OMNIVA: 'omniva'
} as const;

export const INTERNATIONAL_SHIPPING_RATES = {
  LIGHT: {
    maxWeight: 1.0, // 0kg - 1kg
    price: 7
  },
  MEDIUM: {
    maxWeight: 5.0, // 1.1kg - 5kg
    price: 12
  }
} as const; 