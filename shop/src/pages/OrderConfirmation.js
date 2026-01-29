import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getOrderConfirmation } from '../services/orderService';
import { getPaymentInfo, checkBesteronStatus } from '../services/paymentService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-20 h-20 text-green-500"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

const OrderConfirmation = () => {
  const { id } = useParams();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('paymentStatus');
  const verifyPayment = searchParams.get('verifyPayment');

  const [order, setOrder] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
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
        if (data.status === 'PAID' || paymentStatus === 'PAYED') {
            setIsPaid(true);
        }

        try {
            const paymentData = await getPaymentInfo(id);
            setPaymentInfo(paymentData);
        } catch (paymentErr) {
            console.error("Failed to load payment info", paymentErr);
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

  const productItems = order.priceBreakDown?.items.filter(i => i.type === 'PRODUCT') || [];
  const otherItems = order.priceBreakDown?.items.filter(i => i.type !== 'PRODUCT') || [];
  const subtotal = productItems.reduce((acc, item) => acc + (item.priceWithVat * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <CheckIcon />
        <h1 className="text-3xl font-bold mt-4 mb-2">Order Confirmed</h1>
        <p className="text-gray-600 text-lg">Order #{order.orderIdentifier}</p>
        <p className="text-gray-500 mt-2">Thank you for your purchase!</p>
      </div>

      {/* Go to Orders Button */}
      <div className="text-center mb-12">
        <Link
          to="/account/orders"
          className="inline-block bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
        >
          Go to Orders
        </Link>
      </div>

      {/* Payment Feedback Section */}
      <div className="mb-8">
          {isPaid && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
               <p className="font-bold">Payment Successful!</p>
            </div>
          )}

          {!isPaid && paymentStatus === 'ERROR' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Payment Failed!</p>
                <p>There was an error processing your payment.</p>
            </div>
          )}

          {!isPaid && verificationMessage && (
              <div className={`border-l-4 p-4 mb-4 ${verifyingPayment ? 'bg-green-50 border-tany-green text-tany-green' : 'bg-yellow-100 border-yellow-500 text-yellow-700'}`} role="alert">
                  <div className="flex items-center">
                      {verifyingPayment && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-tany-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      <p className="font-bold">{verifyingPayment ? 'Processing...' : 'Info'}</p>
                  </div>
                  <p>{verificationMessage}</p>
              </div>
          )}
      </div>

      {/* Payment Forms (Conditionally Rendered if Not Paid) */}
      {!isPaid && paymentInfo && (
         <div className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
             <h3 className="font-bold text-lg mb-4 text-center">Complete your Payment</h3>

             {/* Global Payments Form */}
             {order.paymentType === 'GLOBAL_PAYMENTS' && paymentInfo.globalPaymentDetails && (
                 <div className="flex flex-col items-center">
                      <form action={paymentInfo.globalPaymentDetails.paymentUrl} method="POST">
                          {Object.entries(paymentInfo.globalPaymentDetails).map(([key, value]) => {
                              if (key === 'paymentUrl') return null;
                              return <input key={key} type="hidden" name={key.toUpperCase()} value={value} />;
                          })}
                          <button type="submit" className="bg-tany-green text-white font-bold py-2 px-6 rounded hover:bg-green-700">
                              Pay Order
                          </button>
                      </form>
                 </div>
             )}

             {/* QR Code / Payme */}
             {paymentInfo.qrCode && (
                 <div className="flex flex-col items-center">
                    <img src={`data:image/png;base64,${paymentInfo.qrCode}`} alt="Payment QR Code" className="w-48 h-48 border border-gray-200 rounded mb-4" />
                    {paymentInfo.paymentLink && (
                         <a
                            href={paymentInfo.paymentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-tany-green text-white font-bold py-2 px-6 rounded hover:bg-green-700 mb-6"
                         >
                            Pay by payme
                         </a>
                    )}
                    <div className="w-full max-w-sm text-sm">
                        {paymentInfo.iban && (
                            <div className="flex justify-between py-2 border-b border-gray-300">
                                <span className="text-gray-600">IBAN:</span>
                                <span className="font-medium select-all">{paymentInfo.iban}</span>
                            </div>
                        )}
                        {paymentInfo.variableSymbol && (
                            <div className="flex justify-between py-2 border-b border-gray-300">
                                <span className="text-gray-600">Variable Symbol:</span>
                                <span className="font-medium select-all">{paymentInfo.variableSymbol}</span>
                            </div>
                        )}
                         <div className="flex justify-between py-2">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-bold text-tany-green">
                                {order.priceBreakDown.totalPrice.toFixed(2)} €
                            </span>
                        </div>
                    </div>
                 </div>
             )}
         </div>
      )}

      {/* Order Summary Table */}
      {order.priceBreakDown && (
      <>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
               <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
           </div>

           {/* Products List */}
           <div>
               {productItems.map((item, idx) => {
                   const name = item.title || item.name;
                   const image = item.image || (item.images && item.images[0]);
                   return (
                       <div key={idx} className="flex items-center p-4 border-b border-gray-100 last:border-0">
                          {image && (
                              <img src={image} alt={name} className="w-16 h-16 object-cover rounded-md bg-gray-100 mr-4" />
                          )}
                          <div className="flex-1">
                              <p className="font-semibold text-gray-900">{name}</p>
                              <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                          </div>
                          <div className="font-medium text-gray-900">
                              {(item.priceWithVat * item.quantity).toFixed(2)} €
                          </div>
                       </div>
                   );
               })}
           </div>
        </div>

        {/* Totals Section */}
        <div className="space-y-3">
             <div className="flex justify-between text-gray-600">
                 <span>Subtotal</span>
                 <span>{subtotal.toFixed(2)} €</span>
             </div>
             {otherItems.map((item, idx) => (
                 <div key={idx} className="flex justify-between text-gray-600">
                     <span>{item.name}</span>
                     <span>{(item.priceWithVat * item.quantity).toFixed(2)} €</span>
                 </div>
             ))}
             <div className="flex justify-between text-gray-600">
                 <span>Tax</span>
                 <span>{order.priceBreakDown.totalPriceVatValue.toFixed(2)} €</span>
             </div>
             <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200 mt-2">
                 <span>Total</span>
                 <span>{order.priceBreakDown.totalPrice.toFixed(2)} €</span>
             </div>
        </div>
      </>
      )}

      {/* Customer Details Footer (Optional/Compact) */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                  <p className="font-bold text-gray-700 mb-1">Delivery Address</p>
                  {order.deliveryAddress ? (
                    <>
                      <p>{order.deliveryAddress.street}</p>
                      <p>{order.deliveryAddress.city}, {order.deliveryAddress.zip}</p>
                    </>
                  ) : <p>N/A</p>}
              </div>
              <div>
                   <p className="font-bold text-gray-700 mb-1">Contact</p>
                   <p>{order.email}</p>
                   <p>{order.phone}</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
