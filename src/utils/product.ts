import { CosmeticProduct } from '../apis';

/**
 * Robustly resolves the best image URL from the Makeup API data.
 * Checks both `api_featured_image` (Amazon S3 hosted by makeup-api)
 * and `image_link` (merchant CDN), converting protocol to secure https.
 */
export const resolveProductImageUrl = (
  product?: Partial<CosmeticProduct> | null
): string | null => {
  if (!product) return null;

  // 1. Check api_featured_image
  if (product.api_featured_image && typeof product.api_featured_image === 'string') {
    const trimmed = product.api_featured_image.trim();
    if (trimmed.startsWith('//')) {
      return `https:${trimmed}`;
    }
    if (trimmed.startsWith('http://')) {
      return trimmed.replace('http://', 'https://');
    }
    if (trimmed.startsWith('https://')) {
      return trimmed;
    }
  }

  // 2. Check image_link
  if (product.image_link && typeof product.image_link === 'string') {
    const trimmed = product.image_link.trim();
    if (trimmed.startsWith('http://')) {
      return trimmed.replace('http://', 'https://');
    }
    if (trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (trimmed.startsWith('//')) {
      return `https:${trimmed}`;
    }
  }

  return null;
};

/**
 * Formats price using price_sign, currency, or default $
 */
export const formatProductPrice = (
  product?: Partial<CosmeticProduct> | null
): string => {
  if (!product || !product.price) return 'Price upon request';
  const priceNum = parseFloat(product.price);
  if (isNaN(priceNum)) return product.price;

  const sign = product.price_sign || '$';
  const currencyPart = product.currency ? ` ${product.currency}` : '';
  return `${sign}${priceNum.toFixed(2)}${currencyPart}`;
};

/**
 * Cleans product name by stripping rogue newlines, carriage returns, and multiple spaces.
 */
export const cleanProductName = (name?: string | null): string => {
  if (!name) return 'Untitled Product';
  return name.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
};

