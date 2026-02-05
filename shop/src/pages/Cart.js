import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import ProductCard from '../components/ProductCard';
import { VAT_RATE } from '../utils/constants';
import './Cart.css';
import usePageMeta from '../hooks/usePageMeta';
import { logViewCart, logGenerateLead } from '../utils/analytics';
import { searchProductsByCategory } from '../services/productService';

const UPSELL_CATEGORY_ID = '6be9f7a5-70fd-41f0-b667-be6036ae6441';

const Cart = () => {
  const { cart, loading, addDiscount, removeDiscount, updateCart } = useCart();
  const { setBreadcrumbs } = useBreadcrumbs();

  usePageMeta("Nákupný košík", "Skontrolujte si svoj nákupný košík.");
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [upsellProducts, setUpsellProducts] = useState([]);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Domov', path: '/' },
      { label: 'Nákupný košík', path: null }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
      const fetchUpsellProducts = async () => {
          try {
              const data = await searchProductsByCategory(
                  UPSELL_CATEGORY_ID,
                  { filterParameters: [] },
                  0,
                  'title,asc',
                  6
              );
              if (data && data.products && data.products.content) {
                  setUpsellProducts(data.products.content);
              }
          } catch (err) {
              console.error("Failed to fetch upsell products", err);
          }
      };
      fetchUpsellProducts();
  }, []);

  // GA4: Log view_cart
  const viewCartLogged = React.useRef(false);
  useEffect(() => {
    if (!loading && cart && !viewCartLogged.current) {
        const items = cart.items || cart.products || [];
        if (items.length > 0) {
            logViewCart(cart);
            viewCartLogged.current = true;
        }
    }
  }, [cart, loading]);

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    setDiscountLoading(true);
    setDiscountError(null);
    try {
      await addDiscount(discountCode);
      setDiscountCode('');
    } catch (err) {
      if (err.status === 404) {
        setDiscountError("Zľavový kód sa nenašiel.");
      } else {
        setDiscountError(err.message || "Failed to apply discount");
      }
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
      if (checked) {
          logGenerateLead("Newsletter Cart");
      }
    } catch (err) {
      console.error("Failed to update newsletter discount", err);
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
         <div className="container">
            <h1>Nákupný košík</h1>
            <p>Načítavam košík...</p>
         </div>
      </div>
    );
  }

  // Normalize data access for different DTO versions
  const cartItems = cart ? (cart.items || cart.products || []) : [];
  const activeDiscounts = cart ? (cart.appliedDiscounts || cart.discounts || []) : [];
  const totalDisplayPrice = cart ? (cart.finalPrice !== undefined ? cart.finalPrice : cart.totalProductPrice) : 0;
  const subTotalDisplayPrice = cart ? (cart.totalPrice !== undefined ? cart.totalPrice : (cart.totalProductPrice || 0)) : 0;
  // If priceBreakdown is available, use it for breakdown logic
  const priceBreakdown = cart ? cart.priceBreakDown : null;
  const totalVat = priceBreakdown ? priceBreakdown.totalPriceVatValue : (totalDisplayPrice - (totalDisplayPrice / VAT_RATE));
  const totalWithoutVat = priceBreakdown ? priceBreakdown.totalPriceWithoutVat : (totalDisplayPrice / VAT_RATE);


  if (!cart || cartItems.length === 0) {
    return (
      <div className="cart-page">
         <div className="container">
            <h1>Nákupný košík</h1>
            <div className="card text-center" style={{ padding: '60px 20px' }}>
                <p className="muted mb-6" style={{ marginBottom: '24px', fontSize: '16px' }}>Váš košík je prázdny.</p>
                <Link className="btn" style={{ maxWidth: '300px', margin: '0 auto' }} to="/">
                    Pokračovať v nákupe
                </Link>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Nákupný košík</h1>

        <div className="cart-layout">
           {/* Items Column */}
           <div>
              <div className="card">
                 {cartItems.map((item) => (
                    <CartItem key={item.id || item.productId} item={item} />
                 ))}
              </div>
           </div>

           {/* Summary Column */}
           <div>
               <div className="card">
                  <h2>Zľavový kód</h2>
                  <form onSubmit={handleApplyDiscount} className="flex gap-2 mb-4">
                     <input
                         type="text"
                         value={discountCode}
                         onChange={(e) => setDiscountCode(e.target.value)}
                         placeholder="Vložte kód"
                         className="flex-1"
                     />
                     <button
                         type="submit"
                         disabled={discountLoading || !discountCode.trim()}
                         className="btn"
                         style={{ marginTop: 0, padding: '12px 20px', width: 'auto' }}
                     >
                         Použiť
                     </button>
                  </form>
                  {discountError && <p className="error-msg">{discountError}</p>}

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
                              title="Odstrániť zľavu"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                  )}

                  <div className="mt-4 pt-4 separator">
                      <label className="checkbox-label">
                         <input
                            type="checkbox"
                            checked={cart.discountForNewsletter || false}
                            onChange={handleNewsletterChange}
                            className="checkbox-input"
                         />
                         <span>Odber newslettera (zľava 10%)</span>
                      </label>
                  </div>
               </div>

               <div className="card">
                   <h2>Zhrnutie</h2>

                   {priceBreakdown ? (
                       // Use price breakdown from API
                       <>
                           {priceBreakdown.items.filter(i => i.type !== 'PRODUCT').map((item, idx) => (
                               <div className="summary-item" key={idx}>
                                  <span>{item.name}</span>
                                  <span>{(item.priceWithVat * item.quantity).toFixed(2)} €</span>
                               </div>
                           ))}
                           <div className="summary-total">
                               <span>Spolu</span>
                               <span>{priceBreakdown.totalPrice.toFixed(2)} €</span>
                           </div>
                           <div className="muted vat-info">
                               Bez DPH: {priceBreakdown.totalPriceWithoutVat.toFixed(2)} € · DPH: {priceBreakdown.totalPriceVatValue.toFixed(2)} €
                           </div>
                       </>
                   ) : (
                       // Fallback calculation
                       <>
                           <div className="summary-item">
                               <span>Medzisúčet</span>
                               <span>{subTotalDisplayPrice.toFixed(2)} €</span>
                           </div>
                           {cart.totalDiscount > 0 && (
                               <div className="summary-item text-green-700">
                                   <span>Zľava</span>
                                   <span>-{cart.totalDiscount.toFixed(2)} €</span>
                               </div>
                           )}
                           <div className="separator"></div>
                           <div className="summary-total">
                               <span>Spolu</span>
                               <span>{totalDisplayPrice.toFixed(2)} €</span>
                           </div>
                           <div className="muted vat-info">
                               Bez DPH: {totalWithoutVat.toFixed(2)} € · DPH: {totalVat.toFixed(2)} €
                           </div>
                       </>
                   )}

                   <Link to="/order" className="btn">
                       Pokračovať v objednávke
                   </Link>

                   <Link to="/" className="btn btn-secondary text-center block no-underline">
                       Späť do obchodu
                   </Link>
               </div>
           </div>
        </div>

        {upsellProducts.length > 0 && (
            <div className="mt-12 mb-12">
                <h2 className="text-xl font-bold mb-4">Mohlo by sa Vám páčiť</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {upsellProducts.map(product => (
                        <div key={product.id} className="h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
