import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductDetailsScreenProps, RootStackParamList } from '../../navigation/types';
import { ProductColor } from '../../apis';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useModal } from '../../context/ModalContext';
import { resolveProductImageUrl, formatProductPrice } from '../../utils/product';

export const useProductDetailsScreen = () => {
  const route = useRoute<ProductDetailsScreenProps['route']>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { product } = route.params;
  const { isAuthenticated } = useAuth();
  const { addToCart, cartCount } = useCart();
  const { showModal } = useModal();

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product.product_colors && product.product_colors.length > 0
      ? product.product_colors[0]
      : null
  );

  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isExpandedDescription, setIsExpandedDescription] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNavigateToCart = () => {
    navigation.navigate('Cart');
  };

  const handleOpenProductLink = async () => {
    const targetUrl = product.product_link || product.website_link;
    if (targetUrl) {
      const canOpen = await Linking.canOpenURL(targetUrl);
      if (canOpen) {
        await Linking.openURL(targetUrl);
      } else {
        showModal({
          type: 'error',
          title: 'Unable to Open Link',
          message: `The URL could not be opened: ${targetUrl}`,
          primaryText: 'Dismiss',
        });
      }
    }
  };

  // ADD TO BAG with Auth Guard & Custom Modal
  const handleAddToBag = () => {
    if (!isAuthenticated) {
      navigation.navigate('Auth', {
        promptTitle: 'Sign in to Add to Bag',
        onSuccess: () => {
          addToCart(product, quantity, selectedColor);
          showModal({
            type: 'success',
            title: 'Added to Bag!',
            message: `${quantity}x "${product.name}" has been placed in your luxury makeup bag.`,
            primaryText: 'View Bag',
            onPrimaryPress: () => navigation.navigate('Cart'),
            secondaryText: 'Keep Shopping',
          });
        },
      });
      return;
    }

    addToCart(product, quantity, selectedColor);
    showModal({
      type: 'success',
      title: 'Added to Bag!',
      message: `${quantity}x "${product.name}"${
        selectedColor?.colour_name ? ` (${selectedColor.colour_name})` : ''
      } has been added to your shopping bag.`,
      primaryText: 'View Bag',
      onPrimaryPress: () => navigation.navigate('Cart'),
      secondaryText: 'Continue Shopping',
    });
  };

  // BUY NOW with Auth Guard & Instant Checkout
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigation.navigate('Auth', {
        promptTitle: 'Sign in to Complete Order',
        onSuccess: () => {
          addToCart(product, quantity, selectedColor);
          navigation.navigate('Cart');
        },
      });
      return;
    }

    addToCart(product, quantity, selectedColor);
    navigation.navigate('Cart');
  };

  // Clean description text
  const cleanDescription = (product.description || '')
    .replace(/\\n/g, '\n')
    .replace(/\t/g, ' ')
    .trim();

  const imageUri = resolveProductImageUrl(product);
  const formattedPrice = formatProductPrice(product);

  return {
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
  };
};
