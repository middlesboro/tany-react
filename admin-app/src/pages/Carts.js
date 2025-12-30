import React from 'react';
import CartList from '../components/CartList';

const Carts = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cart Overview</h1>
      <CartList />
    </div>
  );
};

export default Carts;
