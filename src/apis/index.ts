import { AxiosRequestConfig } from 'axios';
import client, { setAuthToken, getAuthToken, BASE_URL } from './client';

export { client, setAuthToken, getAuthToken, BASE_URL };

/**
 * Cosmetic Product Interfaces
 */
export interface ProductColor {
  hex_value: string;
  colour_name: string | null;
}

export interface CosmeticProduct {
  id: number;
  brand: string;
  name: string;
  price: string | null;
  price_sign: string | null;
  currency: string | null;
  image_link: string;
  product_link: string;
  website_link: string;
  description: string;
  rating: number | null;
  category: string | null;
  product_type: string | null;
  tag_list: string[];
  created_at: string;
  updated_at: string;
  product_api_url: string;
  api_featured_image: string;
  product_colors: ProductColor[];
}

/**
 * Endpoints Dictionary
 */
export const ENDPOINTS = {
  PRODUCTS: {
    BY_BRAND: (brand: string) => `/api/v1/products.json?brand=${encodeURIComponent(brand)}`,
    DETAILS: (id: string | number) => `/api/v1/products/${id}.json`,
    ALL: '/api/v1/products.json',
  },
} as const;

/**
 * Generic Request Helpers
 */
export const get = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await client.get<T>(url, config);
  return response.data;
};

export const post = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await client.post<T>(url, data, config);
  return response.data;
};

/**
 * Cosmetic Store API Services
 */
export const cosmeticApi = {
  /**
   * Fetch products for a specific brand (e.g., 'maybelline', 'dior', 'l\'oreal')
   */
  getProductsByBrand: (
    brand: string,
    params?: {
      product_type?: string;
      product_category?: string;
      price_greater_than?: number;
      price_less_than?: number;
      rating_greater_than?: number;
      rating_less_than?: number;
    }
  ): Promise<CosmeticProduct[]> => {
    return get<CosmeticProduct[]>(ENDPOINTS.PRODUCTS.BY_BRAND(brand), { params });
  },

  /**
   * Fetch individual product details by ID
   */
  getProductDetails: (id: string | number): Promise<CosmeticProduct> => {
    return get<CosmeticProduct>(ENDPOINTS.PRODUCTS.DETAILS(id));
  },

  /**
   * Search / filter across all products
   */
  filterProducts: (params: Record<string, any>): Promise<CosmeticProduct[]> => {
    return get<CosmeticProduct[]>(ENDPOINTS.PRODUCTS.ALL, { params });
  },
};

export default {
  client,
  endpoints: ENDPOINTS,
  setAuthToken,
  getAuthToken,
  get,
  post,
  cosmetics: cosmeticApi,
};
