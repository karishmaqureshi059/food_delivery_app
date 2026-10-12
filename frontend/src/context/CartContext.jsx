import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useNotification } from './NotificationContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { addToast } = useNotification();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('foodexpress_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [cartRestaurant, setCartRestaurant] = useState(() => {
    try {
      const stored = localStorage.getItem('foodexpress_cart_rest');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem('foodexpress_cart_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('foodexpress_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('foodexpress_cart_rest', JSON.stringify(cartRestaurant));
  }, [cartRestaurant]);

  useEffect(() => {
    localStorage.setItem('foodexpress_cart_coupon', JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  // Financial calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.itemTotal * item.quantity), 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    if (appliedCoupon?.discountType === 'free_delivery') return 0;
    return cartRestaurant?.deliveryFee !== undefined ? cartRestaurant.deliveryFee : 40;
  }, [cartItems, cartRestaurant, appliedCoupon]);

  const tax = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return parseFloat((subtotal * 0.08).toFixed(2));
  }, [subtotal, cartItems]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountAmount || 0;
  }, [appliedCoupon]);

  const total = useMemo(() => {
    if (cartItems.length === 0) return 0;
    const finalAmount = subtotal + deliveryFee + tax - discount;
    return Math.max(0, parseFloat(finalAmount.toFixed(2)));
  }, [subtotal, deliveryFee, tax, discount, cartItems]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const addToCart = (food, quantity = 1, selectedCustomizations = [], restaurant = null) => {
    // Check if adding from a different restaurant
    const targetRestId = restaurant?._id || restaurant?.id || food.restaurantId?._id || food.restaurantId;
    const currentRestId = cartRestaurant?._id || cartRestaurant?.id;

    if (cartItems.length > 0 && currentRestId && targetRestId && currentRestId !== targetRestId) {
      const confirmed = window.confirm(
        'Your cart contains items from another restaurant. Would you like to clear your cart and start a fresh order from this restaurant?'
      );
      if (!confirmed) return false;
      clearCart();
    }

    // Calculate extra customization price
    const extraPrice = selectedCustomizations.reduce((acc, c) => acc + (c.price || 0), 0);
    const itemUnitPrice = food.price + extraPrice;

    // Unique key considering customizations
    const custKey = selectedCustomizations.map(c => `${c.name}:${c.selected}`).sort().join('|');
    const uniqueId = `${food._id || food.id}_${custKey}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === uniqueId);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }

      return [
        ...prev,
        {
          cartItemId: uniqueId,
          foodId: food._id || food.id,
          name: food.name,
          price: food.price,
          itemTotal: itemUnitPrice,
          quantity,
          image: food.image,
          isVeg: food.isVeg,
          customization: selectedCustomizations,
          restaurantId: targetRestId
        }
      ];
    });

    if (restaurant) {
      setCartRestaurant({
        id: restaurant._id || restaurant.id,
        _id: restaurant._id || restaurant.id,
        name: restaurant.name,
        deliveryFee: restaurant.deliveryFee !== undefined ? restaurant.deliveryFee : 40,
        minOrder: restaurant.minOrder !== undefined ? restaurant.minOrder : 150,
        address: restaurant.address,
        image: restaurant.image
      });
    }

    addToast(`Added "${food.name}" to cart!`, 'success');
    return true;
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => {
      const filtered = prev.filter(item => item.cartItemId !== cartItemId);
      if (filtered.length === 0) {
        setCartRestaurant(null);
        setAppliedCoupon(null);
      }
      return filtered;
    });
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (couponCode) => {
    if (!couponCode) {
      addToast('Please enter a coupon code', 'warning');
      return false;
    }

    try {
      const data = await api.post('/coupons/validate', {
        code: couponCode,
        orderTotal: subtotal,
        deliveryFee
      });

      if (data.success) {
        setAppliedCoupon(data.coupon);
        addToast(data.message || 'Coupon applied successfully!', 'success');
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Failed to apply coupon', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartRestaurant,
        appliedCoupon,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        totalItemsCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
