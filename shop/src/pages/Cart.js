import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import PriceBreakdown from '../components/PriceBreakdown';
import { VAT_RATE } from '../utils/constants';

const Cart = () => {
  const { cart, loading, addDiscount, removeDiscount, updateCart } = useCart();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Domov', path: '/' },
      { label: 'Nákupný košík', path: null }
    ]);
  }, [setBreadcrumbs]);

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    setDiscountLoading(true);
    setDiscountError(null);
    try {
      await addDiscount(discountCode);
      setDiscountCode('');
    } catch (err) {
      setDiscountError(err.message || "Failed to apply discount");
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleRemoveDiscount = async (code) => {
    try {
      await removeDiscount(code);
    } catch (err) {
      console.error("Failed to remove discount", err);
    }
  };

  const handleNewsletterChange = async (e) => {
    const checked = e.target.checked;
    try {
      const cartId = cart.cartId || cart.id;
      await updateCart({
        cartId,
        discountForNewsletter: checked
      });
    } catch (err) {
      console.error("Failed to update newsletter discount", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <p>Loading cart...</p>
      </div>
    );
  }

  // Normalize data access for different DTO versions
  const cartItems = cart ? (cart.items || cart.products || []) : [];
  const activeDiscounts = cart ? (cart.appliedDiscounts || cart.discounts || []) : [];
  const totalDisplayPrice = cart ? (cart.finalPrice !== undefined ? cart.finalPrice : cart.totalProductPrice) : 0;
  const subTotalDisplayPrice = cart ? (cart.totalPrice !== undefined ? cart.totalPrice : (cart.totalProductPrice || 0)) : 0;


  if (!cart || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cartItems.map((item) => (
                <CartItem key={item.id || item.productId} item={item} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Discount Code</h2>
            <form onSubmit={handleApplyDiscount} className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-tany-green focus:ring-tany-green border p-2"
              />
              <button
                type="submit"
                disabled={discountLoading || !discountCode.trim()}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
              >
                Apply
              </button>
            </form>
            {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}

            {activeDiscounts.length > 0 && (
              <div className="mt-4 space-y-2">
                {activeDiscounts.map((discount, index) => (
                  <div key={index} className="flex justify-between items-center bg-green-50 text-green-700 px-3 py-2 rounded text-sm">
                    <div>
                      <span className="font-bold">{discount.title}</span>
                      {discount.value && <span className="ml-2">(-{discount.value}{discount.discountType === 'PERCENTAGE' ? '%' : '€'})</span>}
                    </div>
                    <button
                      onClick={() => handleRemoveDiscount(discount.code)}
                      className="text-green-900 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cart.discountForNewsletter || false}
                  onChange={handleNewsletterChange}
                  className="rounded border-gray-300 text-tany-green shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">Subscribe to newsletter for 10% discount</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Summary</h2>

            {cart.priceBreakDown ? (
               <PriceBreakdown priceBreakDown={cart.priceBreakDown} />
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{subTotalDisplayPrice.toFixed(2)} €</span>
                  </div>
                  {cart.totalDiscount > 0 && (
                     <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{cart.totalDiscount.toFixed(2)} €</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-4">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Bez DPH:</span>
                      <span className="text-sm text-gray-500">{(totalDisplayPrice / VAT_RATE).toFixed(2)} €</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-xl font-bold text-tany-green">{totalDisplayPrice.toFixed(2)} €</span>
                   </div>
                </div>
              </>
            )}

            <Link to="/order" className="block w-full bg-tany-green text-white text-center font-bold py-3 mt-6 rounded hover:bg-green-700">
              Continue to Order
            </Link>
             <div className="mt-4 text-center">
                <Link to="/" className="text-tany-green hover:text-green-800 font-medium">
                    Continue Shopping
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
