import React, { useEffect, useState } from 'react';
import { getCarts } from '../services/cartAdminService';

const CartList = () => {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const fetchCarts = async () => {
      const data = await getCarts();
      setCarts(data);
    };
    fetchCarts();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cart List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Cart ID</th>
            <th className="py-2 px-4 border-b">Product IDs</th>
          </tr>
        </thead>
        <tbody>
          {carts.map((cart) => (
            <tr key={cart.cartId}>
              <td className="py-2 px-4 border-b">{cart.cartId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartList;
