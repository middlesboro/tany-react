import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getBesteronOrderId } from '../services/paymentService';

const BesteronCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      const transactionId = searchParams.get('transactionId');

      if (!transactionId) {
          setError("Missing transaction ID.");
          return;
      }

      try {
        const orderId = await getBesteronOrderId(transactionId);
        if (orderId) {
            navigate(`/order/confirmation/${orderId}?verifyPayment=besteron`);
        } else {
            setError("Could not retrieve Order ID.");
        }
      } catch (err) {
        console.error("Error processing Besteron callback:", err);
        setError("Failed to process payment callback.");
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  if (error) {
      return (
          <div className="container mx-auto px-4 py-8 text-center text-red-600">
              <p className="font-bold">Error</p>
              <p>{error}</p>
              <button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                  Go Home
              </button>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p>Processing payment callback...</p>
    </div>
  );
};

export default BesteronCallback;
