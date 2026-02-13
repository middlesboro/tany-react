import React from 'react';

const PriceBreakdown = ({ priceBreakDown, showItems = false, cartItems = null }) => {
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
                (cartItems || productItems).map((item, index) => {
                    const name = item.title || item.name;
                    const image = item.image || (item.images && item.images[0]);
                    const quantity = item.quantity;

                    const unitPrice = item.price || item.priceWithVat;
                    const discountPrice = item.discountPrice;

                    const totalOriginal = unitPrice * quantity;
                    const totalDiscounted = discountPrice ? discountPrice * quantity : null;
                    const totalEffective = totalDiscounted !== null ? totalDiscounted : totalOriginal;

                    return (
                        <div key={`prod-${index}`} className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                {image && (
                                    <img
                                        src={image}
                                        alt={name}
                                        className="w-10 h-10 object-cover mr-3 rounded"
                                    />
                                )}
                                <span>{name} {quantity > 1 ? `(${quantity} ks)` : ''}</span>
                            </div>

                            {discountPrice ? (
                                <div className="flex flex-col text-right leading-tight">
                                     <span className="text-xs text-gray-400 line-through font-normal">{totalOriginal.toFixed(2)} €</span>
                                     <span className="font-bold text-red-600">{totalEffective.toFixed(2)} €</span>
                                </div>
                            ) : (
                                <span>{totalEffective.toFixed(2)} €</span>
                            )}
                        </div>
                    );
                })
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
                <div className="flex items-center">
                    {showItems && <div className="w-10 mr-3" />}
                    <span>{item.name}</span>
                </div>
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
                <span className="block text-xl font-bold text-tany-green">{totalPrice.toFixed(2)} €</span>
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
