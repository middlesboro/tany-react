import React from 'react';
import { Link } from 'react-router-dom';

const PriceBreakdown = ({ priceBreakDown, showItems = false }) => {
  if (!priceBreakDown) return null;

  const { items, totalPrice, totalPriceWithoutVat, totalPriceVatValue } = priceBreakDown;

  const productItems = items.filter(item => item.type === 'PRODUCT');
  const otherItems = items.filter(item => item.type !== 'PRODUCT');

  const productsTotal = productItems.reduce((acc, item) => {
      return acc + (item.priceWithVat * item.quantity);
  }, 0);

  return (
    <div className="w-full">
      <div className="space-y-2 text-sm text-gray-600">
        {/* Products */}
        {productItems.length > 0 && (
            showItems ? (
                productItems.map((item, index) => (
                    <div key={`prod-${index}`} className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover mr-3 rounded"
                                />
                            )}
                            <div>
                                {item.id ? (
                                  <Link to={`/products/${item.id}`} className="text-blue-600 hover:underline">
                                    {item.name}
                                  </Link>
                                ) : (
                                  <div>{item.name}</div>
                                )}
                                <div className="text-xs text-gray-500">
                                    Objednané: {item.quantity} ks, Skladom: {item.currentQuantity !== undefined ? item.currentQuantity : '-'} ks
                                </div>
                            </div>
                        </div>
                        <span>{item.priceWithVat} €</span>
                    </div>
                ))
            ) : (
                <div className="flex justify-between">
                    <span>Tovar ({productItems.reduce((acc, i) => acc + i.quantity, 0)} ks)</span>
                    <span>{productsTotal.toFixed(2)} €</span>
                </div>
            )
        )}

        {/* Other Items (Shipping, Payment, Discount) */}
        {otherItems.map((item, index) => (
            <div key={`${item.type}-${index}`} className={`flex justify-between ${item.type === 'DISCOUNT' ? 'text-green-600' : ''}`}>
                <span>{item.name}</span>
                <span>
                    {(item.priceWithVat * item.quantity).toFixed(2)} €
                </span>
            </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-3 mt-3">
        <div className="flex justify-between items-end">
            <span className="text-base font-bold text-gray-900">Spolu:</span>
            <div className="text-right">
                <span className="block text-xl font-bold text-blue-600">{totalPrice.toFixed(2)} €</span>
            </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
             <span>Bez DPH: {totalPriceWithoutVat.toFixed(2)} €</span>
             <span>DPH: {totalPriceVatValue.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
