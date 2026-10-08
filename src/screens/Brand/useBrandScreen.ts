import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BrandScreenProps, RootStackParamList } from '../../navigation/types';
import { cosmeticApi, CosmeticProduct } from '../../apis';
import { useCart } from '../../context/CartContext';

export type SortOption = 'default' | 'price_low' | 'price_high' | 'rating' | 'name';
export type ViewMode = 'grid' | 'list';

export const MANDATORY_PRODUCT_TYPES = [
  'all',
  'blush',
  'bronzer',
  'eyebrow',
  'eyeliner',
  'eyeshadow',
  'foundation',
  'lip_liner',
  'lipstick',
  'mascara',
  'nail_polish',
] as const;

export const useBrandScreen = () => {
  const route = useRoute<BrandScreenProps['route']>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { brandId, brandName, accentColor = '#E11D48' } = route.params;

  const [products, setProducts] = useState<CosmeticProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Price Range (0 - 100)
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);

  // Rating Range (0 - 5)
  const [ratingMin, setRatingMin] = useState(0);
  const [ratingMax, setRatingMax] = useState(5);

  // Filter Tray Modal
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await cosmeticApi.getProductsByBrand(brandId);
      setProducts(data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load products for this brand.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [brandId]);

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // Combine mandatory required product types with any additional types found in API
  const availableProductTypes = useMemo(() => {
    const types = new Set<string>(MANDATORY_PRODUCT_TYPES);
    products.forEach((p) => {
      if (p.product_type) {
        types.add(p.product_type.trim().toLowerCase());
      }
    });
    return Array.from(types);
  }, [products]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSelectedType('all');
    setPriceMin(0);
    setPriceMax(100);
    setRatingMin(0);
    setRatingMax(5);
    setSearchQuery('');
    setSortBy('default');
  }, []);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedType !== 'all') count++;
    if (priceMin > 0 || priceMax < 100) count++;
    if (ratingMin > 0 || ratingMax < 5) count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [selectedType, priceMin, priceMax, ratingMin, ratingMax, searchQuery]);

  // Dynamically Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by product type
    if (selectedType !== 'all') {
      result = result.filter(
        (p) => p.product_type?.trim().toLowerCase() === selectedType
      );
    }

    // Filter by Price Range (price_greater_than & price_less_than)
    result = result.filter((p) => {
      const priceNum = parseFloat(p.price || '0');
      if (isNaN(priceNum) || priceNum <= 0) return true;
      return priceNum >= priceMin && priceNum <= priceMax;
    });

    // Filter by Rating Range (rating_greater_than & rating_less_than)
    result = result.filter((p) => {
      const ratingNum = p.rating ?? 0;
      // If product has no rating, include it when ratingMin is 0
      if (ratingNum === 0 && ratingMin === 0) return true;
      return ratingNum >= ratingMin && ratingNum <= ratingMax;
    });

    // Filter by search query (Bonus requirement)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => {
          const priceA = parseFloat(a.price || '0');
          const priceB = parseFloat(b.price || '0');
          return priceA - priceB;
        });
        break;
      case 'price_high':
        result.sort((a, b) => {
          const priceA = parseFloat(a.price || '0');
          const priceB = parseFloat(b.price || '0');
          return priceB - priceA;
        });
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedType, priceMin, priceMax, ratingMin, ratingMax, searchQuery, sortBy]);

  const handleSelectProduct = (product: CosmeticProduct) => {
    navigation.navigate('ProductDetails', { product });
  };

  const { cartCount } = useCart();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNavigateToCart = () => {
    navigation.navigate('Cart');
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  return {
    brandId,
    brandName,
    accentColor,
    loading,
    refreshing,
    error,
    onRefresh,
    retryFetch: fetchProducts,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    availableProductTypes,
    sortBy,
    setSortBy,
    viewMode,
    toggleViewMode,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    ratingMin,
    setRatingMin,
    ratingMax,
    setRatingMax,
    isFilterModalVisible,
    setIsFilterModalVisible,
    resetFilters,
    activeFilterCount,
    filteredProducts,
    handleSelectProduct,
    handleGoBack,
    handleNavigateToCart,
    cartCount,
    totalCount: products.length,
    filteredCount: filteredProducts.length,
  };
};

export default useBrandScreen;
