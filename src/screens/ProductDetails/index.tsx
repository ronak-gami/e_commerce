import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './style';
import { useProductDetailsScreen } from './useProductDetailsScreen';
import { ProgressiveImage } from '../../components/ProgressiveImage';
import { VectorIcon } from '../../components/VectorIcon';
import { ProductColor } from '../../apis';
import { COLORS } from '../../theme/colors';
import { cleanProductName } from '../../utils/product';

export const ProductDetailsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    product,
    cartCount,
    selectedColor,
    handleSelectColor,
    isFavorite,
    toggleFavorite,
    quantity,
    incrementQuantity,
    decrementQuantity,
    isExpandedDescription,
    setIsExpandedDescription,
    cleanDescription,
    imageUri,
    formattedPrice,
    handleGoBack,
    handleNavigateToCart,
    handleOpenProductLink,
    handleAddToBag,
    handleBuyNow,
  } = useProductDetailsScreen();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.headerActionBtn}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <VectorIcon name="back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerBrandText}>{product.brand}</Text>

        <View style={styles.headerRightRow}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={toggleFavorite}
            activeOpacity={0.7}
          >
            <VectorIcon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? COLORS.primary : '#FFFFFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerActionBtn}
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
      </View>

      {/* Scrollable Product Details */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 110 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Showcase Image with Studio Pedestal & Ambient Stage Glow */}
        <View style={styles.imageShowcase}>
          <View style={styles.stageBackdropGlow} />
          <View style={styles.pedestalCanvas}>
            <ProgressiveImage
              sourceUri={imageUri}
              style={styles.productImage}
            />
            <View style={styles.stageBadge}>
              <Text style={styles.stageBadgeText}>BOUTIQUE LUXE</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          {/* Brand & Type Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.brandChip}>
              <Text style={styles.brandChipText}>{product.brand}</Text>
            </View>
            {product.product_type && (
              <View style={styles.typeChip}>
                <Text style={styles.typeChipText}>{product.product_type}</Text>
              </View>
            )}
            {product.category && (
              <View style={styles.typeChip}>
                <Text style={styles.typeChipText}>{product.category}</Text>
              </View>
            )}
          </View>

          {/* Product Title */}
          <Text style={styles.productTitle}>{cleanProductName(product.name)}</Text>

          {/* Price & Rating (End-to-End Separator) */}
          <View style={styles.priceRatingRow}>
            <Text style={styles.priceValue}>{formattedPrice}</Text>

            {product.rating ? (
              <View style={styles.ratingWrapper}>
                <VectorIcon
                  name="star"
                  size={13}
                  color={COLORS.starRating}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.ratingNumber}>
                  {product.rating.toFixed(1)} / 5.0
                </Text>
              </View>
            ) : null}
          </View>

          {/* Color Swatches */}
          {product.product_colors && product.product_colors.length > 0 && (
            <>
              <View style={styles.swatchesSection}>
                <View style={styles.swatchesHeader}>
                  <Text style={styles.swatchesTitle}>
                    Available Shades ({product.product_colors.length})
                  </Text>
                  {selectedColor?.colour_name && (
                    <Text style={styles.selectedShadeName}>
                      {selectedColor.colour_name}
                    </Text>
                  )}
                </View>

                <View style={styles.swatchesRow}>
                  {product.product_colors.map((color: ProductColor, index: number) => {
                    const isSelected = selectedColor?.hex_value === color.hex_value;
                    return (
                      <TouchableOpacity
                        key={`${color.hex_value}-${index}`}
                        style={[
                          styles.colorSwatchItem,
                          isSelected && styles.colorSwatchItemActive,
                        ]}
                        onPress={() => handleSelectColor(color)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.colorSwatchCircle,
                            { backgroundColor: color.hex_value },
                          ]}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View style={styles.endToEndDivider} />
            </>
          )}

          {/* Tags List */}
          {product.tag_list && product.tag_list.length > 0 && (
            <>
              <View style={styles.tagsRow}>
                {product.tag_list.map((tag: string, index: number) => (
                  <View key={`${tag}-${index}`} style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>#{tag}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.endToEndDivider} />
            </>
          )}

          {/* Product Description */}
          {cleanDescription.length > 0 && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About This Product</Text>
              <Text
                style={styles.descriptionText}
                numberOfLines={isExpandedDescription ? undefined : 4}
              >
                {cleanDescription}
              </Text>
              {cleanDescription.length > 180 && (
                <TouchableOpacity
                  style={styles.readMoreBtn}
                  onPress={() => setIsExpandedDescription(!isExpandedDescription)}
                >
                  <Text style={styles.readMoreText}>
                    {isExpandedDescription ? 'Read Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* External Website / Store Link */}
          {(product.product_link || product.website_link) && (
            <TouchableOpacity
              style={styles.externalLinkBtn}
              onPress={handleOpenProductLink}
              activeOpacity={0.75}
            >
              <Text style={styles.externalLinkText}>
                {product.website_link
                  ? `Official Store (${product.website_link.replace('https://', '').replace('http://', '').replace('/', '')})`
                  : 'Visit Official Brand Page'}
              </Text>
              <VectorIcon name="external-link" size={15} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Checkout Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        {/* Quantity Controller */}
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={decrementQuantity}
            activeOpacity={0.7}
          >
            <VectorIcon name="minus" size={14} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={incrementQuantity}
            activeOpacity={0.7}
          >
            <VectorIcon name="plus" size={14} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Add to Bag Button */}
        <TouchableOpacity
          style={styles.addToBagBtn}
          onPress={handleAddToBag}
          activeOpacity={0.85}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <VectorIcon
              name="cart"
              size={15}
              color={COLORS.primaryLight}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.addToBagText}>ADD TO BAG</Text>
          </View>
        </TouchableOpacity>

        {/* Buy Now Button */}
        <TouchableOpacity
          style={styles.buyNowBtn}
          onPress={handleBuyNow}
          activeOpacity={0.85}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <VectorIcon
              name="sparkles"
              size={15}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.buyNowText}>BUY NOW</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;
