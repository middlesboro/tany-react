import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useLocation } from 'react-router-dom';
import { getOrderConfirmation } from '../services/orderService';
import { ORDER_STATUS_MAPPING } from '../utils/constants';
import { getPaymentInfo, checkBesteronStatus } from '../services/paymentService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import useNoIndex from '../hooks/useNoIndex';
import usePageMeta from '../hooks/usePageMeta';
import { logPurchase } from '../utils/analytics';

const OrderConfirmation = () => {
  useNoIndex();
  usePageMeta("Potvrdenie objednávky", "Ďakujeme za vašu objednávku.");
  const { id } = useParams();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const paymentStatus = searchParams.get('paymentStatus');
  const verifyPayment = searchParams.get('verifyPayment');

  const [order, setOrder] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    setBreadcrumbs([
        { label: 'Domov', path: '/' },
        { label: 'Potvrdenie objednávky', path: null }
    ]);
  }, [setBreadcrumbs]);

  // Handle order fetching and initial paid status check
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderConfirmation(id);
        setOrder(data);

        // Check if already paid based on order status or URL param
        if (data.status === 'PAID') {
            setIsPaid(true);
        }

        try {
            const paymentData = await getPaymentInfo(id);
            setPaymentInfo(paymentData);
        } catch (paymentErr) {
            console.error("Failed to load payment info", paymentErr);
            // We don't block the order view if payment info fails
        }

        if (!isPaid && data.paymentType !== 'COD') {
            setShowPaymentInfo(true);
        }

        // GA4: Log purchase
        // Use sessionStorage to prevent duplicate logging on refresh
        const key = `ga_logged_order_${data.id}`;
        if (!sessionStorage.getItem(key)) {
             logPurchase(data);
             sessionStorage.setItem(key, 'true');
        }

      } catch (err) {
        console.error(err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOrder();
    }
  }, [id, paymentStatus]);

  // Handle Besteron payment verification polling
  useEffect(() => {
      if (verifyPayment === 'besteron' && id && !isPaid) {
          setVerifyingPayment(true);
          // Only show verifying message if we don't have a final result yet
          if (!verificationMessage) {
            setVerificationMessage('Verifying payment status...');
          }

          let attempts = 0;
          const maxAttempts = 8;

          const pollStatus = async () => {
              try {
                  const response = await checkBesteronStatus(id);
                  if (response.status === 'COMPLETED') {
                      setIsPaid(true);
                      setVerifyingPayment(false);
                      setVerificationMessage('');
                  } else {
                      attempts++;
                      if (attempts < maxAttempts) {
                          setTimeout(pollStatus, 3000);
                      } else {
                          setVerifyingPayment(false);
                          setVerificationMessage('There was a problem confirming your payment. Please check your email or contact support.');
                      }
                  }
              } catch (err) {
                  console.error("Verification error", err);
                  attempts++;
                  if (attempts < maxAttempts) {
                     setTimeout(pollStatus, 3000);
                  } else {
                     setVerifyingPayment(false);
                     setVerificationMessage('There was a problem confirming your payment.');
                  }
              }
          };

          pollStatus();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, verifyPayment]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading order details...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  if (!order) return <div className="container mx-auto px-4 py-8">Order not found.</div>;

  const getBreakdownItem = (type) => order.priceBreakDown?.items.find(i => i.type === type);
  const getAllBreakdownItems = (type) => order.priceBreakDown?.items.filter(i => i.type === type) || [];

  const shippingItem = getBreakdownItem('CARRIER');
  const paymentItem = getBreakdownItem('PAYMENT');
  const discountItems = getAllBreakdownItems('DISCOUNT');
  const productItems = getAllBreakdownItems('PRODUCT');

  // Calculate subtotal (sum of products)
  const subtotal = productItems.reduce((acc, item) => acc + (item.priceWithVat * item.quantity), 0);

  return (
    <div className="bg-[#f5f7f6] rounded-[14px] p-4 md:p-6 max-w-[1100px] mx-auto text-[#1f2933] font-sans my-4">
      {/* Messages */}
      {isPaid && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
           <p className="font-bold">Platba úspešná!</p>
           <p>Vaša objednávka bola úspešne zaplatená.</p>
        </div>
      )}

      {!isPaid && paymentStatus === 'ERROR' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
            <p className="font-bold">Platba zlyhala!</p>
            <p>Pri spracovaní vašej platby nastala chyba.</p>
        </div>
      )}

      {!isPaid && verificationMessage && (
          <div className={`border-l-4 p-4 mb-8 ${verifyingPayment ? 'bg-green-50 border-[#1f7a4d] text-[#1f7a4d]' : 'bg-yellow-100 border-yellow-500 text-yellow-700'}`} role="alert">
              <div className="flex items-center">
                  {verifyingPayment && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#1f7a4d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <p className="font-bold">{verifyingPayment ? 'Spracováva sa...' : 'Info'}</p>
              </div>
              <p>{verificationMessage}</p>
          </div>
      )}

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#eef9f3] to-white rounded-[14px] p-6 md:p-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <div className="w-[72px] h-[72px] rounded-full bg-[#e9f6ef] text-[#1f7a4d] flex items-center justify-center text-4xl mx-auto mb-4">
               <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {ORDER_STATUS_MAPPING[order.status] || order.status}
          </h1>
          <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-[#e9f6ef] text-[#1f7a4d] font-semibold">
              Objednávka #{order.orderIdentifier}
          </span>
          {order.carrierOrderStateLink && (
              <div className="mt-4">
                  <a href={order.carrierOrderStateLink} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[#1f7a4d] hover:bg-green-700">
                      Sledovať zásielku
                  </a>
              </div>
          )}
          <p className="mt-4 text-gray-600">
              Ďakujeme za váš nákup!<br/>
              Potvrdenie sme poslali na <strong>{order.email}</strong>
          </p>
      </section>

      {/* GRID */}
      <section className=" gap-6 mt-8">
          {/* RIGHT */}
          <div className="space-y-4">
               <div className="bg-white rounded-[14px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
                  <h3 className="text-lg font-bold mb-4">Osobné a doručovacie údaje</h3>
                  <div className="text-gray-600 mb-1.5">{order.firstname} {order.lastname}</div>
                  <div className="text-gray-600 mb-1.5">{order.email}</div>
                  <div className="text-gray-600 mb-4">{order.phone}</div>

                   {order.deliveryAddress ? (
                       <>
                           <h3 className="text-lg font-bold mb-4">Doručovacia adresa</h3>
                           <div className="text-gray-600 mb-1.5">{order.deliveryAddress.street}</div>
                           <div className="text-gray-600 mb-1.5">{order.deliveryAddress.city}, {order.deliveryAddress.zip}</div>
                           <div className="text-gray-600 mb-4">{order.deliveryAddress.country}</div>
                       </>
                   ) : <div className="text-gray-600">N/A</div>}

                   {order.invoiceAddress ? (
                       <>
                           <h3 className="text-lg font-bold mb-4">Fakturačná adresa</h3>
                           <div className="text-gray-600 mb-1.5">{order.invoiceAddress.street}</div>
                           <div className="text-gray-600 mb-1.5">{order.invoiceAddress.city}, {order.invoiceAddress.zip}</div>
                           <div className="text-gray-600 mb-4">{order.invoiceAddress.country}</div>
                       </>
                   ) : <div className="text-gray-600">N/A</div>}
               </div>

               {/* Payment Info Card if Not Paid */}
               {showPaymentInfo && (
                   <div className="bg-white rounded-[14px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.05)] border-l-4 border-[#1f7a4d]">
                      <h3 className="text-lg font-bold mb-4 text-[#1f7a4d]">Platba</h3>

                      {order.paymentType === 'GLOBAL_PAYMENTS' && paymentInfo && paymentInfo.globalPaymentDetails ? (
                         <div className="flex flex-col items-center">
                             <p className="mb-4 text-gray-700">Pre platbu kartou kliknite nižšie:</p>
                             <form action={paymentInfo.globalPaymentDetails.paymentUrl} method="POST">
                                 {Object.entries(paymentInfo.globalPaymentDetails).map(([key, value]) => {
                                     if (key === 'paymentUrl') return null;
                                     return <input key={key} type="hidden" name={key.toUpperCase()} value={value} />;
                                 })}
                                 <button type="submit" className="bg-[#1f7a4d] text-white font-bold py-2 px-6 rounded hover:bg-green-700">
                                     Zaplatiť
                                 </button>
                             </form>
                         </div>
                      ) : (
                        paymentInfo && paymentInfo.qrCode && (
                            <div className="flex flex-col items-center">
                                <p className="mb-4 text-gray-700 text-sm">Naskenujte QR kód pre platbu:</p>
                                <img src={`data:image/png;base64,${paymentInfo.qrCode}`} alt="Payment QR Code" className="w-48 h-48 border border-gray-200 rounded mb-4" />

                                {paymentInfo.paymentLink && (
                                     <a
                                        href={paymentInfo.paymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#1f7a4d] text-white font-bold py-2 px-6 rounded hover:bg-green-700 mb-6 text-sm"
                                     >
                                        Zaplatiť cez Payme
                                     </a>
                                )}

                                <div className="w-full text-sm">
                                    <div className="mb-2">
                                        Zaplatiť za objednávku môžete cez službu Payme. Jedná sa o službu Slovenskej Bankovej Asociácie.
                                        Po kilknutí na tlačidlo "Zaplatiť cez Payme" budete presmerovaný na stránku Payme, kde môžete dokončiť platbu prostredníctvom vašej bankovej aplikácie alebo QR kódu.
                                    </div>
                                    <div className="mb-2">
                                        Taktiež môžete zaplatiť manuálnym zadaním údajom vo vašom internet bankingu pomocou nasledujúcich údajov:
                                    </div>
                                    {paymentInfo.iban && (
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="text-gray-600">IBAN:</span>
                                            <span className="font-medium break-all text-right ml-2">{paymentInfo.iban}</span>
                                        </div>
                                    )}
                                    {paymentInfo.variableSymbol && (
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="text-gray-600">Var. symbol:</span>
                                            <span className="font-medium">{paymentInfo.variableSymbol}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600">Suma:</span>
                                        <span className="font-bold text-[#1f7a4d]">
                                            {order.priceBreakDown.totalPrice.toFixed(2)} €
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                      )}
                   </div>
               )}
          </div>
      </section>

      {/* PRODUCTS */}
      <section className="mt-8 bg-white rounded-[14px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
          <h3 className="text-lg font-bold mb-4">Zakúpené produkty</h3>
          <div className="space-y-4">
              {productItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                       <img src={item.image || (item.images && item.images[0]) || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                       <div className="flex-1">
                          <div className="font-semibold">{item.name}</div>
                           <div className="text-gray-600 text-sm">{item.quantity} ks</div>
                       </div>
                       <div className="font-semibold">{(item.priceWithVat * item.quantity).toFixed(2)} €</div>
                  </div>
              ))}
          </div>
      </section>

        {/* LEFT */}
        <div className="bg-white rounded-[14px] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.05)] h-fit mt-8">
            <h3 className="text-lg font-bold mb-4">Rekapitulácia</h3>

            <div className="flex justify-between mb-2.5">
                <span className="text-gray-600">Medzisúčet</span>
                <span>{subtotal.toFixed(2)} €</span>
            </div>

            {discountItems.map((item, idx) => (
                <div key={idx} className="flex justify-between mb-2.5 text-[#1f7a4d]">
                    <span>{item.name}</span>
                    {/* Discounts are usually negative in value, if not, negate them */}
                    <span>{(item.priceWithVat * item.quantity).toFixed(2)} €</span>
                </div>
            ))}

            {/* Shipping */}
            {shippingItem && (
                <div className="flex justify-between mb-2.5">
                    <span className="text-gray-600">Doprava</span>
                    <span>{(shippingItem.priceWithVat)} €</span>
                </div>
            )}

            {/* Payment Fee */}
            {paymentItem && Math.abs(paymentItem.priceWithVat) > 0 && (
                <div className="flex justify-between mb-2.5">
                    <span className="text-gray-600">{paymentItem.name}</span>
                    <span>{(paymentItem.priceWithVat)} €</span>
                </div>
            )}

            <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 text-lg font-bold text-[#1f7a4d]">
                <span>SPOLU</span>
                <span>{order.priceBreakDown.totalPrice.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between mt-1.5 text-sm text-gray-500">
                <span>Bez DPH: {order.priceBreakDown.totalPriceWithoutVat.toFixed(2)} €</span>
                <span>DPH: {order.priceBreakDown.totalPriceVatValue.toFixed(2)} €</span>
            </div>
        </div>


      {/* FOOTER */}
      <footer className="mt-10 text-center">
           <div className="text-gray-600 mb-4">
              Odoslanie očakávame: <strong>1–2 pracovné dni</strong>
           </div>
           <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/" className="px-7 py-3.5 rounded-[10px] font-semibold text-white bg-[#1f7a4d] hover:opacity-90 transition-opacity">
                  Pokračovať v nákupe
              </Link>
              <Link to="/account/orders" className="px-7 py-3.5 rounded-[10px] font-semibold bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors">
                  Sledovať objednávku
              </Link>
           </div>
      </footer>
    </div>
  );
};

export default OrderConfirmation;
