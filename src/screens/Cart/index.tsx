import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './style';
import { useCartScreen } from './useCartScreen';
import { ProgressiveImage } from '../../components/ProgressiveImage';
import { VectorIcon } from '../../components/VectorIcon';
import { COLORS } from '../../theme/colors';
import { resolveProductImageUrl, cleanProductName } from '../../utils/product';
import { KeyboardAwareContainer } from '../../components/Keyboard';

export const CartScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    items,
    cartCount,
    cartTotal,
    shippingCost,
    estimatedTax,
    discount,
    finalTotal,
    promoCode,
    setPromoCode,
    handleApplyPromo,
    updateQuantity,
    removeFromCart,
    handleCheckout,
    handleGoBack,
  } = useCartScreen();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handleGoBack}>
          <VectorIcon name="back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Shopping Bag</Text>
          <Text style={styles.headerCount}>{cartCount} items</Text>
        </View>

        <View style={styles.headerRightPlaceholder} />
      </View>

      {items.length === 0 ? (
        <View style={[styles.emptyBox, { paddingBottom: insets.bottom + 40 }]}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(225, 29, 72, 0.12)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
              borderWidth: 1,
              borderColor: 'rgba(225, 29, 72, 0.25)',
            }}
          >
            <VectorIcon name="cart" size={38} color={COLORS.primaryLight} />
          </View>
          <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
          <Text style={styles.emptySub}>
            Discover luxury cosmetic collections and add your favorite beauty items.
          </Text>
          <TouchableOpacity
            style={styles.startShoppingBtn}
            onPress={handleGoBack}
          >
            <Text style={styles.startShoppingBtnText}>Explore Brands</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <KeyboardAwareContainer
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 110 + insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
            bottomOffset={30}
          >
            {/* Cart Items List */}
            {items.map((cartItem) => {
              const imageUri = resolveProductImageUrl(cartItem.product);
              const priceNum = parseFloat(cartItem.product.price || '0');
              const itemTotal = isNaN(priceNum)
                ? 'N/A'
                : `$${(priceNum * cartItem.quantity).toFixed(2)}`;

              return (
                <View key={cartItem.id} style={styles.cartItemCard}>
                  <View style={styles.itemImageWrapper}>
                    <ProgressiveImage
                      sourceUri={imageUri}
                      style={styles.itemImage}
                    />
                  </View>

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemBrand}>
                      {cartItem.product.brand}
                    </Text>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {cleanProductName(cartItem.product.name)}
                    </Text>

                    {cartItem.selectedColor && (
                      <View style={styles.itemShadeRow}>
                        <View
                          style={[
                            styles.shadeDot,
                            {
                              backgroundColor:
                                cartItem.selectedColor.hex_value,
                            },
                          ]}
                        />
                        <Text style={styles.shadeNameText}>
                          {cartItem.selectedColor.colour_name || 'Selected Shade'}
                        </Text>
                      </View>
                    )}

                    <Text style={styles.itemPrice}>{itemTotal}</Text>
                  </View>

                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => removeFromCart(cartItem.id)}
                    >
                      <VectorIcon name="trash" size={16} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() =>
                          updateQuantity(cartItem.id, cartItem.quantity - 1)
                        }
                      >
                        <VectorIcon name="minus" size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{cartItem.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() =>
                          updateQuantity(cartItem.id, cartItem.quantity + 1)
                        }
                      >
                        <VectorIcon name="plus" size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Promo Code Box */}
            <View style={styles.promoCard}>
              <TextInput
                style={styles.promoInput}
                placeholder="Promo code (e.g. BEAUTY20)"
                placeholderTextColor="#64748B"
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.applyPromoBtn}
                onPress={handleApplyPromo}
              >
                <Text style={styles.applyPromoText}>APPLY</Text>
              </TouchableOpacity>
            </View>

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ${cartTotal.toFixed(2)}
                </Text>
              </View>

              {discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Promo Discount</Text>
                  <Text style={[styles.summaryValue, styles.discountValue]}>
                    −${discount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  {shippingCost === 0
                    ? 'FREE'
                    : `$${shippingCost.toFixed(2)}`}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Estimated Taxes (8%)</Text>
                <Text style={styles.summaryValue}>
                  ${estimatedTax.toFixed(2)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>
                  ${finalTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </KeyboardAwareContainer>

          {/* Sticky Checkout Bar */}
          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutBtnText}>
                PROCEED TO CHECKOUT • ${finalTotal.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default CartScreen;
