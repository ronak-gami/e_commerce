import { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, BrandInfo } from '../../navigation/types';
import { useCart } from '../../context/CartContext';
import { cosmeticApi, CosmeticProduct } from '../../apis';

export interface CosmeticBrandData extends BrandInfo {
  iconText: string;
  badge: string;
  productCountText: string;
  popularCategory: string;
}

export const COSMETIC_BRANDS: CosmeticBrandData[] = [
  {
    id: 'dior',
    name: 'Dior',
    tagline: 'Haute Couture & Timeless Beauty',
    origin: 'Paris, France',
    accentColor: '#D946EF',
    iconText: 'CD',
    badge: 'Luxury',
    productCountText: '70+ Products',
    popularCategory: 'Lipstick & Foundation',
  },
  {
    id: 'maybelline',
    name: 'Maybelline',
    tagline: 'Maybe she is born with it',
    origin: 'New York, USA',
    accentColor: '#F43F5E',
    iconText: 'MN',
    badge: 'Trending',
    productCountText: '50+ Products',
    popularCategory: 'Mascara & Bronzer',
  },
  {
    id: "l'oreal",
    name: "L'Oréal",
    tagline: 'Because You are Worth It',
    origin: 'Paris, France',
    accentColor: '#E11D48',
    iconText: 'LO',
    badge: 'Iconic',
    productCountText: '45+ Products',
    popularCategory: 'Skin & Lips',
  },
  {
    id: 'glossier',
    name: 'Glossier',
    tagline: 'Skin First, Makeup Second',
    origin: 'New York, USA',
    accentColor: '#EC4899',
    iconText: 'GL',
    badge: 'Clean Beauty',
    productCountText: 'Curated',
    popularCategory: 'Cloud Paint & Balm',
  },
  {
    id: 'revlon',
    name: 'Revlon',
    tagline: 'Live Boldly with Classic Glamour',
    origin: 'New York, USA',
    accentColor: '#DC2626',
    iconText: 'RV',
    badge: 'Classic',
    productCountText: '25+ Products',
    popularCategory: 'Lipsticks & Nails',
  },
  {
    id: 'covergirl',
    name: 'Covergirl',
    tagline: 'Easy, Breezy, Beautiful',
    origin: 'Maryland, USA',
    accentColor: '#0EA5E9',
    iconText: 'CG',
    badge: 'Cruelty-Free',
    productCountText: '50+ Products',
    popularCategory: 'Lash Blast & Powder',
  },
  {
    id: 'annabelle',
    name: 'Annabelle',
    tagline: 'Vibrant Canadian Color Artistry',
    origin: 'Montreal, Canada',
    accentColor: '#F59E0B',
    iconText: 'AB',
    badge: 'Artistry',
    productCountText: '10+ Products',
    popularCategory: 'Liners & Pigments',
  },
];

export const useHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<CosmeticProduct[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const { cartCount } = useCart();

  // Load trending cosmetic products from API for the home showcase
  useEffect(() => {
    let isMounted = true;
    const loadFeatured = async () => {
      try {
        const data = await cosmeticApi.getProductsByBrand('maybelline');
        if (isMounted && data) {
          // Take top rated or first 6 products
          setFeaturedProducts(data.slice(0, 8));
        }
      } catch (err) {
        console.warn('Could not load featured products on home:', err);
      } finally {
        if (isMounted) setFeaturedLoading(false);
      }
    };
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBrands = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return COSMETIC_BRANDS;

    return COSMETIC_BRANDS.filter(
      (brand) =>
        brand.name.toLowerCase().includes(query) ||
        brand.tagline.toLowerCase().includes(query) ||
        brand.popularCategory.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectBrand = (brand: CosmeticBrandData) => {
    navigation.navigate('Brand', {
      brandId: brand.id,
      brandName: brand.name,
      accentColor: brand.accentColor,
    });
  };

  const handleSelectProduct = (product: CosmeticProduct) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleNavigateToCart = () => {
    navigation.navigate('Cart');
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredBrands,
    featuredProducts,
    featuredLoading,
    handleSelectBrand,
    handleSelectProduct,
    handleNavigateToCart,
    cartCount,
  };
};
