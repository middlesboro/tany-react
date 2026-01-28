import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useLocation } from 'react-router-dom';
import { getOrderConfirmation } from '../services/orderService';
import { getPaymentInfo, checkBesteronStatus } from '../services/paymentService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import PriceBreakdown from '../components/PriceBreakdown';
import { VAT_RATE } from '../utils/constants';

const OrderConfirmation = () => {
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
            // We don't block the order view if payment info fails
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
      // We only want to start this once when component mounts or dependencies change to true
      // But implementing polling inside useEffect requires care with closures.
      // Since `pollStatus` is recursive via setTimeout, it will run.
      // We disable the effect re-running on every render by checking conditions.
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, verifyPayment]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading order details...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  if (!order) return <div className="container mx-auto px-4 py-8">Order not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {isPaid && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
           <p className="font-bold">Payment Successful!</p>
           <p>Your order has been paid successfully.</p>
        </div>
      )}

      {!isPaid && paymentStatus === 'ERROR' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
            <p className="font-bold">Payment Failed!</p>
            <p>There was an error processing your payment.</p>
        </div>
      )}

      {!isPaid && verificationMessage && (
          <div className={`border-l-4 p-4 mb-8 ${verifyingPayment ? 'bg-green-50 border-tany-green text-tany-green' : 'bg-yellow-100 border-yellow-500 text-yellow-700'}`} role="alert">
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

      {location.state?.newOrder && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
            <p className="font-bold">Thank you!</p>
            <p>Your order has been placed successfully.</p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Číslo objednávky {order.orderIdentifier}</h1>

      {/* Personal Info */}
      <div className="bg-white shadow rounded p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <span className="block text-sm font-medium text-gray-500">Name</span>
                  <span className="block text-gray-900">{order.firstname} {order.lastname}</span>
              </div>
              <div>
                  <span className="block text-sm font-medium text-gray-500">Email</span>
                  <span className="block text-gray-900">{order.email}</span>
              </div>
              <div>
                  <span className="block text-sm font-medium text-gray-500">Phone</span>
                  <span className="block text-gray-900">{order.phone}</span>
              </div>
              {order.selectedPickupPointId && (
                  <div>
                      <span className="block text-sm font-medium text-gray-500">Pickup Point ID</span>
                      <span className="block text-gray-900">{order.selectedPickupPointId}</span>
                  </div>
              )}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          {order.deliveryAddress ? (
            <div>
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.zip}</p>
            </div>
          ) : <p>N/A</p>}
        </div>
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-bold mb-4">Invoice Address</h2>
          {order.invoiceAddress ? (
            <div>
              <p>{order.invoiceAddress.street}</p>
              <p>{order.invoiceAddress.city}, {order.invoiceAddress.zip}</p>
            </div>
          ) : <p>N/A</p>}
        </div>
      </div>

      {!isPaid && paymentInfo && order.paymentType === 'GLOBAL_PAYMENTS' && paymentInfo.globalPaymentDetails ? (
           <div className="bg-white shadow rounded p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              <div className="flex flex-col items-center">
                  <p className="mb-4 text-gray-700">Please pay for your order using Global Payments:</p>
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
           </div>
      ) : (
        !isPaid && paymentInfo && paymentInfo.qrCode && (
            <div className="bg-white shadow rounded p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                <div className="flex flex-col items-center">
                    <p className="mb-4 text-gray-700">Scan the QR code to pay:</p>
                    <img src={`data:image/png;base64,${paymentInfo.qrCode}`} alt="Payment QR Code" className="w-64 h-64 border border-gray-200 rounded mb-4" />

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

                    <div className="w-full max-w-sm">
                        {paymentInfo.iban && (
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">IBAN:</span>
                                <span className="font-medium">{paymentInfo.iban}</span>
                            </div>
                        )}
                        {paymentInfo.variableSymbol && (
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Variable Symbol:</span>
                                <span className="font-medium">{paymentInfo.variableSymbol}</span>
                            </div>
                        )}
                        {order.priceBreakDown && (
                             <div className="flex justify-between py-2">
                                <span className="text-gray-600">Amount:</span>
                                <span className="font-bold text-tany-green">
                                    {order.priceBreakDown.totalPrice.toFixed(2)} €
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
      )}

      {isPaid && (
          <div className="bg-white shadow rounded p-6 mb-8 text-center">
               <h2 className="text-xl font-bold mb-4">Payment Information</h2>
               <p className="text-green-600 font-bold">This order has been paid.</p>
          </div>
      )}

      {order.priceBreakDown && (
          <div className="bg-white shadow rounded p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Rekapitulácia objednávky</h2>
              <PriceBreakdown priceBreakDown={order.priceBreakDown} showItems={true} />
          </div>
      )}

      <div className="text-center">
        <Link to="/" className="inline-block bg-tany-green text-white font-bold py-3 px-8 rounded hover:bg-green-700">
            Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
