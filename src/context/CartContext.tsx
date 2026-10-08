import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CosmeticProduct, ProductColor } from '../apis';
import { storage, STORAGE_KEYS } from '../services/storage';

export interface CartItem {
  id: string; // unique item key: productId + colorHex
  product: CosmeticProduct;
  quantity: number;
  selectedColor?: ProductColor | null;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: CosmeticProduct, quantity?: number, color?: ProductColor | null) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore cart on boot
  useEffect(() => {
    const restoreCart = async () => {
      const savedItems = await storage.getItem<CartItem[]>(STORAGE_KEYS.CART_ITEMS, []);
      if (savedItems && Array.isArray(savedItems)) {
        setItems(savedItems);
      }
      setIsLoaded(true);
    };
    restoreCart();
  }, []);

  // Save cart whenever items change after initial load
  useEffect(() => {
    if (isLoaded) {
      storage.setItem(STORAGE_KEYS.CART_ITEMS, items);
    }
  }, [items, isLoaded]);

  const addToCart = (
    product: CosmeticProduct,
    quantity = 1,
    color?: ProductColor | null
  ) => {
    const itemKey = `${product.id}_${color?.hex_value || 'default'}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prevItems,
        {
          id: itemKey,
          product,
          quantity,
          selectedColor: color,
        },
      ];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((it) => it.id !== itemId);
      }
      return prevItems.map((it) => (it.id === itemId ? { ...it, quantity } : it));
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((it) => it.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = useMemo(() => {
    return items.reduce((acc, it) => acc + it.quantity, 0);
  }, [items]);

  const cartTotal = useMemo(() => {
    return items.reduce((acc, it) => {
      const price = parseFloat(it.product.price || '0');
      return acc + (isNaN(price) ? 0 : price * it.quantity);
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
