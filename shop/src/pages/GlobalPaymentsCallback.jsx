import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyGlobalPayment } from '../services/paymentService';

const GlobalPaymentsCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      const params = {};
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }

      try {
        const response = await verifyGlobalPayment(params);
        // Assuming params has MD which maps to order ID
        const orderId = params.MD;
        if (orderId) {
            navigate(`/order/confirmation/${orderId}?paymentStatus=${response.status}`);
        } else {
            console.error("Order ID (MD) missing in callback params");
            // Fallback or error page? For now, redirect to home or some error
             navigate('/');
        }
      } catch (error) {
        console.error("Payment verification failed", error);
        // Even on error, we might want to redirect back to order to show error?
        // But if verification fails, we might not know the status.
        // If we have orderId, let's go back with error.
        const orderId = params.MD;
        if (orderId) {
             navigate(`/order/confirmation/${orderId}?paymentStatus=ERROR`);
        } else {
             navigate('/');
        }
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p>Processing payment...</p>
    </div>
  );
};

export default GlobalPaymentsCallback;
