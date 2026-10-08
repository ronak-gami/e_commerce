import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  RefreshControl,
  Modal,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './style';
import { useBrandScreen, MANDATORY_PRODUCT_TYPES } from './useBrandScreen';
import { ProgressiveImage } from '../../components/ProgressiveImage';
import { VectorIcon } from '../../components/VectorIcon';
import { RangeSlider } from '../../components/RangeSlider';
import { CosmeticProduct } from '../../apis';
import { COLORS } from '../../theme/colors';
import { resolveProductImageUrl, formatProductPrice, cleanProductName } from '../../utils/product';

export const BrandScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    brandName,
    loading,
    refreshing,
    error,
    onRefresh,
    retryFetch,
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
    filteredCount,
  } = useBrandScreen();

  // Quick-Return Collapsible Header State (Strictly bounded)
  const [collapsibleHeight, setCollapsibleHeight] = useState(172);
  const [headerVisible, setHeaderVisible] = useState(true);
  const headerAnim = useRef(new Animated.Value(1)).current; // 1 = expanded, 0 = collapsed
  const isHeaderVisibleRef = useRef(true);
  const lastScrollY = useRef(0);

  const showHeader = () => {
    if (!isHeaderVisibleRef.current) {
      isHeaderVisibleRef.current = true;
      setHeaderVisible(true);
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: false,
      }).start();
    }
  };

  const hideHeader = () => {
    if (isHeaderVisibleRef.current) {
      isHeaderVisibleRef.current = false;
      setHeaderVisible(false);
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    // Near the top: always show header
    if (currentY <= 15) {
      showHeader();
    } else if (diff > 12 && currentY > 50) {
      // User is scrolling DOWN -> collapse controls
      hideHeader();
    } else if (diff < -12) {
      // User is scrolling UP -> expand controls
      showHeader();
    }

    lastScrollY.current = currentY;
  };

  // Re-open header whenever active filters or search terms change
  useEffect(() => {
    showHeader();
  }, [selectedType, searchQuery, sortBy, priceMin, priceMax, ratingMin, ratingMax]);

  const animatedHeaderHeight = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, collapsibleHeight],
  });

  const animatedHeaderOpacity = headerAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.2, 1],
  });

  const cleanDescriptionText = (desc: string | null | undefined): string => {
    if (!desc) return '';
    return desc
      .replace(/<[^>]*>?/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const renderProductItem = ({ item }: { item: CosmeticProduct }) => {
    const imageUri = resolveProductImageUrl(item);
    const priceDisplay = formatProductPrice(item);
    const shortDesc = cleanDescriptionText(item.description);
    const productName = cleanProductName(item.name);

    if (viewMode === 'list') {
      return (
        <TouchableOpacity
          style={styles.productListCard}
          activeOpacity={0.85}
          onPress={() => handleSelectProduct(item)}
        >
          <View style={styles.listImageContainer}>
            <ProgressiveImage
              sourceUri={imageUri}
              style={styles.productImage}
            />
          </View>

          <View style={styles.listProductInfo}>
            {item.product_type ? (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText} numberOfLines={1}>
                  {item.product_type.replace(/_/g, ' ')}
                </Text>
              </View>
            ) : null}

            <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
              {productName}
            </Text>

            {shortDesc.length > 0 && (
              <Text style={styles.productShortDesc} numberOfLines={2}>
                {shortDesc}
              </Text>
            )}

            <View style={styles.listFooter}>
              <Text style={styles.priceText}>{priceDisplay}</Text>
              {item.rating ? (
                <View style={styles.ratingBadge}>
                  <VectorIcon
                    name="star"
                    size={11}
                    color={COLORS.starRating}
                    style={{ marginRight: 3 }}
                  />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // Grid View Card
    return (
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.85}
        onPress={() => handleSelectProduct(item)}
      >
        <View style={styles.imageContainer}>
          <ProgressiveImage
            sourceUri={imageUri}
            style={styles.productImage}
          />
        </View>

        {item.product_type ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText} numberOfLines={1}>
              {item.product_type.replace(/_/g, ' ')}
            </Text>
          </View>
        ) : null}

        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {productName}
        </Text>

        {shortDesc.length > 0 && (
          <Text style={styles.productShortDesc} numberOfLines={2}>
            {shortDesc}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.priceText}>{priceDisplay}</Text>
          {item.rating ? (
            <View style={styles.ratingBadge}>
              <VectorIcon
                name="star"
                size={11}
                color={COLORS.starRating}
                style={{ marginRight: 3 }}
              />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>

        {item.product_colors && item.product_colors.length > 0 ? (
          <Text style={styles.shadesIndicator}>
            ● {item.product_colors.length} shades
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <VectorIcon name="back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{brandName}</Text>
          <Text style={styles.headerSubtitle}>
            {loading ? 'Fetching catalog...' : `${filteredCount} items`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={handleNavigateToCart}
          activeOpacity={0.7}
        >
          <VectorIcon name="cart" size={20} color="#FFFFFF" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Collapsible Controls Panel (Strictly bounded with overflow: 'hidden') */}
      <Animated.View
        style={[
          styles.collapsibleWrapper,
          {
            height: animatedHeaderHeight,
            opacity: animatedHeaderOpacity,
          },
        ]}
        pointerEvents={headerVisible ? 'auto' : 'none'}
      >
        <View
          style={styles.collapsibleInner}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && Math.abs(h - collapsibleHeight) > 2) {
              setCollapsibleHeight(h);
            }
          }}
        >
          {/* In-brand Search Bar */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchBar}>
              <VectorIcon name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${brandName} products...`}
                placeholderTextColor="#64748B"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearSearch}
                >
                  <VectorIcon name="close" size={14} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter Action Bar (Filter Drawer Trigger, Active Count, Reset, View Mode) */}
          <View style={styles.filterActionRow}>
            <View style={styles.filterBtnGroup}>
              <TouchableOpacity
                style={styles.filterTriggerBtn}
                onPress={() => setIsFilterModalVisible(true)}
                activeOpacity={0.8}
              >
                <VectorIcon name="filter" size={14} color={COLORS.primaryLight} />
                <Text style={styles.filterTriggerText}>Filters</Text>
                {activeFilterCount > 0 && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>{activeFilterCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {activeFilterCount > 0 && (
                <TouchableOpacity
                  style={styles.resetFilterBtn}
                  onPress={resetFilters}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resetFilterText}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.viewModeBtn}
              onPress={toggleViewMode}
              activeOpacity={0.7}
            >
              <VectorIcon
                name={viewMode === 'grid' ? 'grid' : 'list'}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Product Type Quick Filter Carousel (10 Required Types) */}
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterCarousel}
            >
              {availableProductTypes.map((type) => {
                const isActive = selectedType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.filterPill, isActive && styles.filterPillActive]}
                    onPress={() => setSelectedType(type)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        isActive && styles.filterPillTextActive,
                      ]}
                    >
                      {type === 'all' ? 'All Types' : type.replace(/_/g, ' ')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Quick Sort Chips */}
          <View style={styles.sortContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sortRow}
            >
              <Text style={styles.sortLabel}>Sort:</Text>
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'default' && styles.sortChipActive]}
                onPress={() => setSortBy('default')}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'default' && styles.sortChipTextActive,
                  ]}
                >
                  Featured
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sortChip,
                  sortBy === 'price_low' && styles.sortChipActive,
                ]}
                onPress={() => setSortBy('price_low')}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'price_low' && styles.sortChipTextActive,
                  ]}
                >
                  Price: Low to High
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sortChip,
                  sortBy === 'price_high' && styles.sortChipActive,
                ]}
                onPress={() => setSortBy('price_high')}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'price_high' && styles.sortChipTextActive,
                  ]}
                >
                  Price: High to Low
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]}
                onPress={() => setSortBy('rating')}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'rating' && styles.sortChipTextActive,
                  ]}
                >
                  Top Rated
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'name' && styles.sortChipActive]}
                onPress={() => setSortBy('name')}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'name' && styles.sortChipTextActive,
                  ]}
                >
                  Name (A-Z)
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Animated.View>

      {/* Main Content Area */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading {brandName} collection...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <VectorIcon name="alert" size={38} color={COLORS.warning} />
          <Text style={styles.errorTitle}>Could not load products</Text>
          <Text style={styles.errorSub}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retryFetch}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <VectorIcon name="search" size={44} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No matching products</Text>
          <Text style={styles.emptySub}>
            Try adjusting your price range, rating, or product type filters.
          </Text>
          <TouchableOpacity style={styles.clearFiltersBtn} onPress={resetFilters}>
            <Text style={styles.clearFiltersBtnText}>Reset All Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          key={viewMode}
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={viewMode === 'grid' ? 2 : 1}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingTop: 8,
              paddingBottom: 30 + insets.bottom,
            },
          ]}
          renderItem={renderProductItem}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        />
      )}

      {/* Interactive Filter Drawer Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalDragHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Refine Products</Text>
              <View style={styles.modalHeaderActions}>
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={styles.modalResetText}>Reset All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setIsFilterModalVisible(false)}
                >
                  <VectorIcon name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Product Type Filter Section */}
              <Text style={styles.modalSectionTitle}>Product Category</Text>
              <View style={styles.modalPillContainer}>
                {MANDATORY_PRODUCT_TYPES.map((type) => {
                  const isActive = selectedType === type;
                  return (
                    <TouchableOpacity
                      key={`modal-${type}`}
                      style={[
                        styles.filterPill,
                        isActive && styles.filterPillActive,
                      ]}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          isActive && styles.filterPillTextActive,
                        ]}
                      >
                        {type === 'all' ? 'All Types' : type.replace(/_/g, ' ')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Price Range Slider (price_greater_than & price_less_than: 0 - 100) */}
              <RangeSlider
                min={0}
                max={100}
                low={priceMin}
                high={priceMax}
                step={1}
                prefix="$"
                label="Price Range ($0 – $100)"
                onValueChange={(lo, hi) => {
                  setPriceMin(lo);
                  setPriceMax(hi);
                }}
              />

              {/* Rating Range Slider (rating_greater_than & rating_less_than: 0 - 5) */}
              <RangeSlider
                min={0}
                max={5}
                low={ratingMin}
                high={ratingMax}
                step={0.5}
                suffix=" ★"
                label="Rating Range (0 – 5 Stars)"
                onValueChange={(lo, hi) => {
                  setRatingMin(lo);
                  setRatingMax(hi);
                }}
              />

              {/* Apply Action Button */}
              <TouchableOpacity
                style={styles.modalApplyBtn}
                onPress={() => setIsFilterModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalApplyBtnText}>
                  SHOW {filteredCount} {filteredCount === 1 ? 'PRODUCT' : 'PRODUCTS'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BrandScreen;
