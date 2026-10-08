import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './style';
import { useHomeScreen, CosmeticBrandData } from './useHomeScreen';
import { VectorIcon } from '../../components/VectorIcon';
import { ProgressiveImage } from '../../components/ProgressiveImage';
import { KeyboardAwareContainer } from '../../components/Keyboard';
import { resolveProductImageUrl, formatProductPrice, cleanProductName } from '../../utils/product';
import { COLORS } from '../../theme/colors';

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    searchQuery,
    setSearchQuery,
    filteredBrands,
    featuredProducts,
    featuredLoading,
    handleSelectBrand,
    handleSelectProduct,
    handleNavigateToCart,
    cartCount,
  } = useHomeScreen();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      <KeyboardAwareContainer
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Boutique Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerSubtitle}>Luxe Cosmetic Boutique</Text>
            <Text style={styles.headerTitle}>Curated Brands</Text>
          </View>

          <TouchableOpacity
            style={styles.headerCartBtn}
            onPress={handleNavigateToCart}
            activeOpacity={0.7}
          >
            <VectorIcon name="cart" size={22} color="#FFFFFF" />
            {cartCount > 0 && (
              <View style={styles.headerCartBadge}>
                <Text style={styles.headerCartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.endToEndDivider} />

        {/* Feature Hero Card with Luxury Accent */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>TOP COLLECTIONS</Text>
          </View>
          <Text style={styles.heroTitle}>Beauty & Elegance Redefined</Text>
          <Text style={styles.heroSub}>
            Discover premier cosmetics from iconic global fashion houses.
          </Text>
        </View>

        {/* Search Input with Vector Icon */}
        <View style={styles.searchContainer}>
          <VectorIcon name="search" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search brands or categories..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <VectorIcon name="close" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Live Trending API Products Carousel */}
        {featuredProducts.length > 0 && (
          <>
            <View style={styles.featuredSection}>
              <View style={styles.featuredHeader}>
                <Text style={styles.featuredTitleHeader}>Trending Right Now</Text>
              </View>

              {featuredLoading ? (
                <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredScroll}
                >
                  {featuredProducts.map((product) => {
                    const imageUri = resolveProductImageUrl(product);
                    const formattedPrice = formatProductPrice(product);

                    return (
                      <TouchableOpacity
                        key={product.id}
                        style={styles.featuredCard}
                        activeOpacity={0.85}
                        onPress={() => handleSelectProduct(product)}
                      >
                        <View style={styles.featuredImageWrapper}>
                          <ProgressiveImage
                            sourceUri={imageUri}
                            style={styles.featuredImage}
                          />
                        </View>

                        <Text style={styles.featuredBrand} numberOfLines={1}>
                          {product.brand}
                        </Text>
                        <Text style={styles.featuredName} numberOfLines={1}>
                          {cleanProductName(product.name)}
                        </Text>

                        <View style={styles.featuredFooter}>
                          <Text style={styles.featuredPrice}>{formattedPrice}</Text>
                          {product.rating ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <VectorIcon name="star" size={11} color={COLORS.starRating} style={{ marginRight: 2 }} />
                              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.starRating }}>
                                {product.rating.toFixed(1)}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
            <View style={styles.endToEndDivider} />
          </>
        )}

        {/* Brand Section Header */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Featured Brands</Text>
          <View style={styles.sectionCountBadge}>
            <Text style={styles.sectionCountText}>
              {filteredBrands.length} Brands
            </Text>
          </View>
        </View>

        {/* Brand Cards Grid */}
        {filteredBrands.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No brands found</Text>
            <Text style={styles.emptyStateSub}>
              Try searching with another keyword
            </Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredBrands.map((brand: CosmeticBrandData) => (
              <TouchableOpacity
                key={brand.id}
                style={styles.brandCard}
                activeOpacity={0.82}
                onPress={() => handleSelectBrand(brand)}
              >
                <View style={styles.brandCardTop}>
                  <View
                    style={[
                      styles.brandMonogram,
                      { backgroundColor: brand.accentColor },
                    ]}
                  >
                    <Text style={styles.brandMonogramText}>
                      {brand.iconText}
                    </Text>
                  </View>
                  <View style={styles.brandBadge}>
                    <Text style={styles.brandBadgeText}>{brand.badge}</Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.brandName} numberOfLines={1}>
                    {brand.name}
                  </Text>
                  <Text style={styles.brandTagline} numberOfLines={2}>
                    {brand.tagline}
                  </Text>
                </View>

                <View style={styles.brandCardBottom}>
                  <Text style={styles.brandProductCount}>
                    {brand.productCountText}
                  </Text>
                  <VectorIcon name="arrow-forward" size={14} color={COLORS.primaryLight} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </KeyboardAwareContainer>
    </View>
  );
};

export default HomeScreen;
