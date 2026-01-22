import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
            <th className="py-2 px-4 border-b text-left">Cart ID</th>
            <th className="py-2 px-4 border-b text-left">Customer Name</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {carts.map((cart) => (
            <tr key={cart.cartId}>
              <td className="py-2 px-4 border-b">{cart.cartId}</td>
              <td className="py-2 px-4 border-b">{cart.customerName}</td>
              <td className="py-2 px-4 border-b">
                <Link
                  to={`/admin/carts/${cart.cartId}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                >
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartList;
