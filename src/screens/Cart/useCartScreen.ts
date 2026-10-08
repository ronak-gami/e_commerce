import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

export const useCartScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showModal } = useModal();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const shippingCost = cartTotal > 35 || cartTotal === 0 ? 0 : 4.99;
  const estimatedTax = cartTotal * 0.08;
  const finalTotal = Math.max(0, cartTotal - discount + shippingCost + estimatedTax);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'BEAUTY20') {
      const disc = cartTotal * 0.2;
      setDiscount(disc);
      showModal({
        type: 'success',
        title: 'Promo Applied!',
        message: 'You unlocked a 20% beauty discount on this entire order.',
        primaryText: 'Continue',
      });
    } else {
      showModal({
        type: 'warning',
        title: 'Invalid Promo Code',
        message: 'The code entered is not valid. Use code "BEAUTY20" to receive 20% off.',
        primaryText: 'Got It',
      });
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      showModal({
        type: 'info',
        title: 'Shopping Bag is Empty',
        message: 'Add items from your favorite cosmetic brands before checking out.',
        primaryText: 'Explore Brands',
        onPrimaryPress: () => navigation.navigate('Home'),
      });
      return;
    }

    if (!isAuthenticated) {
      navigation.navigate('Auth', {
        promptTitle: 'Sign in to Checkout',
        onSuccess: () => {
          showModal({
            type: 'success',
            title: 'Order Confirmed!',
            message: `Thank you for your purchase. Your grand total of $${finalTotal.toFixed(2)} has been charged.`,
            primaryText: 'Back to Home',
            onPrimaryPress: () => {
              clearCart();
              navigation.navigate('Home');
            },
          });
        },
      });
      return;
    }

    showModal({
      type: 'success',
      title: 'Order Placed Successfully!',
      message: `Your cosmetics order has been confirmed! Total: $${finalTotal.toFixed(2)}. Tracking info will be sent to your email.`,
      primaryText: 'Return to Boutique',
      onPrimaryPress: () => {
        clearCart();
        navigation.navigate('Home');
      },
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
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
  };
};
