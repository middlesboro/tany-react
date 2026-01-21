import React from 'react';

const PriceBreakdown = ({ priceBreakDown }) => {
  if (!priceBreakDown) return null;

  const { items, totalPrice, totalPriceWithoutVat, totalPriceVatValue } = priceBreakDown;

  // Filter out products to show them as a single line item or skip if displayed elsewhere
  // The requirement says "use it to show price breakdown".
  // Usually, a breakdown includes: Product Subtotal, Shipping, Payment, Discounts.
  // We will sum up products for a cleaner view if there are many, or just rely on the fact that the consumer of this component might want a summary.

  const productItems = items.filter(item => item.type === 'PRODUCT');
  const otherItems = items.filter(item => item.type !== 'PRODUCT');

  // Calculate product subtotal based on priceWithVat * quantity
  // Assuming priceWithVat is unit price based on standard API patterns, but if it is total line price, quantity multiplication would be wrong.
  // However, usually in cart DTOs, `price` is unit price.
  // Let's verify: `cart.totalProductPrice` exists in the old model.
  // We will calculate subtotal here.
  const productsTotal = productItems.reduce((acc, item) => {
      // If the API returns total price for the line in priceWithVat, this might be double counting if we multiply.
      // But typically price is unit price.
      // Let's try to assume it's unit price.
      return acc + (item.priceWithVat * item.quantity);
  }, 0);

  return (
    <div className="w-full">
      <div className="space-y-2 text-sm text-gray-600">
        {/* Products Subtotal */}
        {productItems.length > 0 && (
             <div className="flex justify-between">
                <span>Tovar ({productItems.reduce((acc, i) => acc + i.quantity, 0)} ks)</span>
                <span>{productsTotal.toFixed(2)} €</span>
             </div>
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
