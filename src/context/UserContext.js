'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState({ name: 'Guest User', email: 'guest@example.com' });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('jutay_wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (e) {
      console.error("Failed to load wishlist", e);
    }
    setIsHydrated(true);
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('jutay_wishlist', JSON.stringify(wishlist));
      } catch (e) {
        console.error("Failed to save wishlist", e);
      }
    }
  }, [wishlist, isHydrated]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <UserContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        user,
        setUser,
        isHydrated
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
