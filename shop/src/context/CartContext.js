import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCustomerContext } from '../services/customerService';
import {
  addToCart as addToCartService,
  updateCart as updateCartService,
  removeFromCart as removeFromCartService,
  addDiscount as addDiscountService,
  removeDiscount as removeDiscountService
} from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContext = useCallback(async () => {
    try {
      const storedCartId = localStorage.getItem('cartId');
      const data = await getCustomerContext(storedCartId);

      if (data.cartDto) {
          if (data.cartDto.cartId) {
              localStorage.setItem('cartId', data.cartDto.cartId);
          }
          const cartData = { ...data.cartDto };
          if (data.discountForNewsletter !== undefined) {
              cartData.discountForNewsletter = data.discountForNewsletter;
          }
          setCart(cartData);
      }
      if (data.customerDto) {
          setCustomer(data.customerDto);
      }
    } catch (error) {
      console.error("Failed to fetch customer context", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  const addToCart = useCallback(async (productId, quantity) => {
    try {
      const storedCartId = localStorage.getItem('cartId');
      const newCartId = await addToCartService(storedCartId, productId, quantity);

      if (newCartId) {
          const idToSave = typeof newCartId === 'object' ? newCartId.cartId : newCartId;
          localStorage.setItem('cartId', idToSave);

          // Refresh context to show updated cart
          await fetchContext();
      }
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error; // Re-throw so component can handle it if needed
    }
  }, [fetchContext]);

  const removeFromCart = useCallback(async (productId) => {
    try {
      const storedCartId = localStorage.getItem('cartId');
      if (!storedCartId) return;

      await removeFromCartService(storedCartId, productId);
      await fetchContext();
    } catch (error) {
      console.error("Failed to remove from cart", error);
      throw error;
    }
  }, [fetchContext]);

  const updateCart = useCallback(async (cartData) => {
      try {
          await updateCartService(cartData);
          await fetchContext();
      } catch (error) {
          console.error("Failed to update cart", error);
          throw error;
      }
  }, [fetchContext]);

  const clearCart = useCallback(async () => {
    localStorage.removeItem('cartId');
    await fetchContext();
  }, [fetchContext]);

  const addDiscount = useCallback(async (code) => {
    try {
      const storedCartId = localStorage.getItem('cartId');
      if (!storedCartId) throw new Error("No cart found");

      const updatedCart = await addDiscountService(storedCartId, code);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Failed to add discount", error);
      throw error;
    }
  }, []);

  const removeDiscount = useCallback(async (code) => {
    try {
      const storedCartId = localStorage.getItem('cartId');
      if (!storedCartId) return;

      const updatedCart = await removeDiscountService(storedCartId, code);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Failed to remove discount", error);
      throw error;
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, customer, addToCart, removeFromCart, updateCart, clearCart, addDiscount, removeDiscount, loading, refreshCustomer: fetchContext }}>
      {children}
    </CartContext.Provider>
  );
};
