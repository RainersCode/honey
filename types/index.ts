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

export interface Dictionary {
  navigation: {
    home: string;
    products: string;
    about: string;
    contact: string;
    cart: string;
    login: string;
    register: string;
    logout: string;
  };
  admin: {
    nav: {
      overview: string;
      products: string;
      orders: string;
      users: string;
      shipping: string;
      countries: string;
    };
    overview: string;
    products: string;
    orders: string;
    users: string;
    settings: string;
    createProduct: string;
    editProduct: string;
    deleteProduct: string;
    deleteProductConfirm: string;
    categories: string;
    createCategory: string;
    editCategory: string;
    deleteCategory: string;
    deleteCategoryConfirm: string;
    categoryKey: string;
    categoryName: string;
    categoryDescription: string;
    categoryImage: string;
    categoryFormDescription: string;
    create: string;
    update: string;
    adminDashboard: string;
    actions: string;
    orderStatus: {
      notPaid: string;
      notShipped: string;
      notDelivered: string;
      details: string;
      clearFilter: string;
      filteredBy: string;
    };
    dashboard: {
      totalRevenue: string;
      sales: string;
      customers: string;
      products: string;
      overview: string;
      recentSales: string;
      totalProducts: string;
      totalOrders: string;
      registeredUsers: string;
      totalRevenueSub: string;
      buyer: string;
      date: string;
      total: string;
      actions: string;
      details: string;
    };
    countries: {
      title: string;
      addNew: string;
      addDescription: string;
      list: string;
      listDescription: string;
      name: string;
      namePlaceholder: string;
      code: string;
      codePlaceholder: string;
      flag: string;
      flagPlaceholder: string;
      status: string;
      actions: string;
      enable: string;
      disable: string;
      addSuccess: string;
      updateSuccess: string;
  common: {
    loading: string;
    error: string;
    success: string;
    addToCart: string;
    removeFromCart: string;
    price: string;
    quantity: string;
    total: string;
    checkout: string;
    backToHome: string;
    search: string;
    status: string;
    inStock: string;
    outOfStock: string;
    available: string;
    description: string;
    reviews: string;
    customerReviews: string;
  };
  auth: {
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    loginTitle: string;
    registerTitle: string;
  };
  home: {
    hero: {
      title: string;
      description: string;
      cta: string;
    };
    latestArrivals: string;
    about: {
      title: string;
      imageAlt: string;
      description1: string;
      description2: string;
      cta: string;
    };
  };
  about: {
    meta: {
      title: string;
      description: string;
    };
    hero: {
      title: string;
      imageAlt: string;
    };
    mission: {
      title: string;
      description1: string;
      description2: string;
      imageAlt: string;
    };
    process: {
      title: string;
      step1: {
        title: string;
        description: string;
        iconAlt: string;
      };
      step2: {
        title: string;
        description: string;
        iconAlt: string;
      };
      step3: {
        title: string;
        description: string;
        iconAlt: string;
      };
    };
    values: {
      title: string;
      imageAlt: string;
      value1: {
        title: string;
        description: string;
      };
      value2: {
        title: string;
        description: string;
      };
      value3: {
        title: string;
        description: string;
      };
    };
    cta: {
      title: string;
      description: string;
      button: string;
    };
  };
  products: {
    meta: {
      title: string;
      searchTitle: string;
      categoryTitle: string;
    };
    search: {
      placeholder: string;
      button: string;
    };
    sort: {
      label: string;
      newest: string;
      lowestPrice: string;
      highestPrice: string;
    };
    categories: {
      all: {
        name: string;
        description: string;
      };
      honey: {
        name: string;
        description: string;
      };
      beeswax: {
        name: string;
        description: string;
      };
      honeycomb: {
        name: string;
        description: string;
      };
    };
    filters: {
      currentlyViewing: string;
      viewProducts: string;
    };
    noResults: string;
  };
  order: {
    meta: {
      title: string;
      description: string;
    };
    title: string;
    shipping: {
      title: string;
      phone: string;
      deliveredAt: string;
      shippedAt: string;
      notShipped: string;
    };
    payment: {
      title: string;
      method: string;
      paidAt: string;
      notPaid: string;
    };
    items: {
      title: string;
      image: string;
      name: string;
      quantity: string;
      price: string;
      total: string;
    };
    summary: {
      title: string;
      items: string;
      shipping: string;
      tax: string;
      total: string;
    };
    buttons: {
      processing: string;
      markAsPaid: string;
      markAsDelivered: string;
      markAsShipped: string;
    };
    paypal: {
      loading: string;
      error: string;
    };
    stripe: {
      submit: string;
      errors: {
        unexpected: string;
      };
    };
  };
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  description: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  banner: string | null;
  price: string;
  weight: number | null;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export interface CartItem {
  productId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  qty: number;
  weight: number; // Weight in ounces
  slug: string;
}

export interface Cart {
  items: CartItem[];
  itemsPrice: number;
  shippingPrice?: number;
  totalPrice: number;
}

export type ShippingAddress = {
  fullName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  deliveryMethod: 'international' | 'omniva';
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
  userFacingId: string;
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
