'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, DurationType, Coupon } from '@/types';
import { validateCoupon } from '@/lib/store-db';
import { DEFAULT_SITE_CONFIG } from '@/lib/config';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  currency: 'PKR' | 'USD';
  setCurrency: (c: 'PKR' | 'USD') => void;
  addToCart: (product: Product, duration?: DurationType) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  coupon: Coupon | null;
  couponCodeInput: string;
  setCouponCodeInput: (code: string) => void;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  total: number;
  formatPrice: (amountInPKR: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<'PKR' | 'USD'>(DEFAULT_SITE_CONFIG.defaultCurrency);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexora_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCurr = localStorage.getItem('nexora_currency');
      if (savedCurr === 'PKR' || savedCurr === 'USD') {
        setCurrency(savedCurr);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexora_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const handleSetCurrency = (newCurr: 'PKR' | 'USD') => {
    setCurrency(newCurr);
    localStorage.setItem('nexora_currency', newCurr);
  };

  const addToCart = (product: Product, duration?: DurationType) => {
    const chosenDuration = duration || product.duration;
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, selectedDuration: chosenDuration }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setCouponCodeInput('');
  };

  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const subtotalInPKR = items.reduce((acc, item) => acc + item.product.pricePKR * item.quantity, 0);
    const platform = items[0]?.product.platform;
    const result = validateCoupon(code, subtotalInPKR, platform);
    if (result.valid && (result.discountPercentage || result.discountAmount)) {
      setCoupon({
        code: code.trim().toUpperCase(),
        discountPercentage: result.discountPercentage || 0,
        active: true,
        usageCount: 0,
      });
      return true;
    } else {
      setCouponError(result.message);
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCodeInput('');
    setCouponError(null);
  };

  // Calculations
  const rate = DEFAULT_SITE_CONFIG.pkrToUsdRate || 280;
  const subtotalPKR = items.reduce((acc, item) => acc + item.product.pricePKR * item.quantity, 0);
  const discountAmountPKR = coupon ? Math.round((subtotalPKR * coupon.discountPercentage) / 100) : 0;
  const totalPKR = Math.max(0, subtotalPKR - discountAmountPKR);

  const subtotal = currency === 'PKR' ? subtotalPKR : Number((subtotalPKR / rate).toFixed(2));
  const discountAmount = currency === 'PKR' ? discountAmountPKR : Number((discountAmountPKR / rate).toFixed(2));
  const total = currency === 'PKR' ? totalPKR : Number((totalPKR / rate).toFixed(2));

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const formatPrice = (amountInPKR: number): string => {
    if (currency === 'PKR') {
      return `Rs. ${amountInPKR.toLocaleString()}`;
    }
    const inUsd = (amountInPKR / rate).toFixed(2);
    return `$${inUsd}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        currency,
        setCurrency: handleSetCurrency,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        coupon,
        couponCodeInput,
        setCouponCodeInput,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        total,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
