import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/orderService';
import { ORDER_STATUS_MAPPING } from '../utils/constants';

const CustomerOrderList = ({ onOrderSelect }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrders(page, size);
        setOrders(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setError("Nepodarilo sa načítať objednávky.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  if (loading && orders.length === 0) {
    return <div className="text-center py-8">Načítavam objednávky...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nemáte žiadne objednávky.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded p-4 md:p-8 mb-4">
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <span className="font-semibold text-gray-900 text-lg">Objednávka #{order.orderIdentifier}</span>
                <span className="text-sm text-gray-500">{new Date(order.createDate).toLocaleString('sk-SK')}</span>
              </div>
              <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2">
                <span className={`inline-block px-3 py-1 text-xs font-semibold leading-tight text-gray-800 bg-gray-100 rounded-full`}>
                  {ORDER_STATUS_MAPPING[order.status] || order.status}
                </span>
                <span className="font-bold text-gray-900 text-lg">{order.finalPrice?.toFixed(2)} €</span>
              </div>
            </div>
            <button
              onClick={() => onOrderSelect(order.id)}
              className="w-full md:w-auto text-center px-4 py-2 border border-tany-green text-tany-green rounded hover:bg-tany-green hover:text-white transition-colors font-medium mt-2 md:mt-0"
            >
              Detail objednávky
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className={`px-3 py-1 rounded mr-2 ${page === 0 ? 'bg-gray-200 text-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Predchádzajúca
          </button>
          <span className="text-sm text-gray-700">
            Strana {page + 1} z {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className={`px-3 py-1 rounded ml-2 ${page + 1 >= totalPages ? 'bg-gray-200 text-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Ďalšia
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerOrderList;
