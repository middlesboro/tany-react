import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCustomerContext } from '../services/customerService';
import { addToCart as addToCartService } from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContext = async () => {
    try {
      const storedCartId = localStorage.getItem('cartId');
      const data = await getCustomerContext(storedCartId);

      if (data.cartDto) {
          if (data.cartDto.id) {
              localStorage.setItem('cartId', data.cartDto.id);
          }
          setCart(data.cartDto);
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
          const idToSave = typeof newCartId === 'object' ? newCartId.id : newCartId;
          localStorage.setItem('cartId', idToSave);

          // Refresh context to show updated cart
          await fetchContext();
      }
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error; // Re-throw so component can handle it if needed
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};
