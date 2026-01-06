import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useLocation } from 'react-router-dom';
import { getOrder } from '../services/orderService';
import { getPaymentInfo, checkBesteronStatus } from '../services/paymentService';

const OrderConfirmation = () => {
  const { id } = useParams();
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

  // Handle order fetching and initial paid status check
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id);
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
          <div className={`border-l-4 p-4 mb-8 ${verifyingPayment ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-yellow-100 border-yellow-500 text-yellow-700'}`} role="alert">
              <div className="flex items-center">
                  {verifyingPayment && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

      <h1 className="text-3xl font-bold mb-6">Order #{order.id}</h1>

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
                      <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">
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
                    <img src={`data:image/png;base64,${paymentInfo.qrCode}`} alt="Payment QR Code" className="w-64 h-64 border border-gray-200 rounded" />
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

      <div className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {order.items && order.items.map((item) => (
                    <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                {item.image && (
                                    <div className="flex-shrink-0 h-10 w-10 mr-4">
                                        <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt={item.name} />
                                    </div>
                                )}
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.price ? `${item.price.toFixed(2)} €` : '-'}
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(item.price && item.quantity) ? `${(item.price * item.quantity).toFixed(2)} €` : '-'}
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="mt-4 flex justify-end">
            <div className="text-xl font-bold">
                Total Price: {order.finalPrice ? `${order.finalPrice.toFixed(2)} €` : '-'}
            </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded hover:bg-blue-700">
            Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
