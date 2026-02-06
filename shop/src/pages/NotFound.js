import React from 'react';
import ProductSearch from '../components/ProductSearch';
import SeoHead from '../components/SeoHead';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <SeoHead title="Stránka sa nenašla" description="Požadovaná stránka neexistuje." />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Stránka sa nenašla</h1>
      <p className="text-lg text-gray-600 mb-8">
        Je nám ľúto, ale stránka, ktorú hľadáte, neexistuje.
        Skúste použiť vyhľadávanie nižšie.
      </p>
      <div className="max-w-xl mx-auto">
        <ProductSearch />
      </div>
    </div>
  );
};

export default NotFound;
