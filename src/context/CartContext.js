'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jutay_cart');
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when cart items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('jutay_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart", e);
      }
    }
  }, [cartItems, isHydrated]);

  const addToCart = (product, size, color, quantity = 1, maxStock = null) => {
    setCartItems((prevItems) => {
      // Find if item with same id, size, and color already exists
      const existingIdx = prevItems.findIndex(
        (item) => item.id === product.id && item.size === size && item.color === color
      );

      // Determine max stock to use
      const stockLimit = maxStock !== null ? maxStock : (product.sizeStock && product.sizeStock[size] !== undefined ? product.sizeStock[size] : product.stock);

      if (existingIdx !== -1) {
        const newItems = [...prevItems];
        const newQty = newItems[existingIdx].quantity + quantity;
        newItems[existingIdx].quantity = stockLimit !== undefined && stockLimit !== null ? Math.min(newQty, stockLimit) : newQty;
        newItems[existingIdx].maxStock = stockLimit; // Update maxStock
        return newItems;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            image: product.images[0],
            vendor: product.vendor,
            size,
            color,
            quantity: stockLimit !== undefined && stockLimit !== null ? Math.min(quantity, stockLimit) : quantity,
            maxStock: stockLimit
          }
        ];
      }
    });
    setCartOpen(true); // Automatically open cart drawer when adding item
  };

  const removeFromCart = (id, size, color) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.size === size && item.color === color))
    );
  };

  const updateQuantity = (id, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id && item.size === size && item.color === color) {
          const limitedQty = item.maxStock !== undefined && item.maxStock !== null ? Math.min(quantity, item.maxStock) : quantity;
          return { ...item, quantity: limitedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isHydrated
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
