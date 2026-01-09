import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCustomerContext } from '../services/customerService';
import { addToCart as addToCartService, updateCart as updateCartService } from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContext = async () => {
    try {
      const storedCartId = localStorage.getItem('cartId');
      const data = await getCustomerContext(storedCartId);

      if (data.cartDto) {
          if (data.cartDto.cartId) {
              localStorage.setItem('cartId', data.cartDto.cartId);
          }
          setCart(data.cartDto);
      }
      if (data.customerDto) {
          setCustomer(data.customerDto);
      }
    } catch (error) {
      console.error("Failed to fetch customer context", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContext();
  }, []);

  const addToCart = async (productId, quantity) => {
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
  };

  const updateCart = async (cartData) => {
      try {
          await updateCartService(cartData);
          await fetchContext();
      } catch (error) {
          console.error("Failed to update cart", error);
          throw error;
      }
  };

  const clearCart = async () => {
    localStorage.removeItem('cartId');
    await fetchContext();
  };

  return (
    <CartContext.Provider value={{ cart, customer, addToCart, updateCart, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};
