import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrder } from '../services/orderService';
import { VAT_RATE, ORDER_STATUS_MAPPING } from '../utils/constants';

const CustomerOrderDetail = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order details", err);
        setError("Nepodarilo sa načítať detaily objednávky.");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) return <div className="text-center py-8">Načítavam detaily objednávky...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!order) return null;

  const deliveryItem = order.priceBreakDown?.items?.find(i => i.type === 'CARRIER');
  const deliveryPrice = deliveryItem ? deliveryItem.priceWithVat : (order.deliveryPrice || 0);
  const discountItems = order.priceBreakDown?.items?.filter(i => i.type === 'DISCOUNT') || [];

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <button
        onClick={onBack}
        className="mb-4 text-tany-green hover:text-green-800 font-medium flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Späť na zoznam
      </button>

      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-2xl font-bold mb-2">Objednávka #{order.orderIdentifier}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
           <div><span className="font-bold">Stav:</span> {ORDER_STATUS_MAPPING[order.status] || order.status}</div>
           <div><span className="font-bold">Platba:</span> {order.paymentName}</div>
           <div><span className="font-bold">Doprava:</span> {order.carrierName}</div>
        </div>
        {order.carrierOrderStateLink && (
            <div className="mt-4">
                <a href={order.carrierOrderStateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-tany-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Sledovať zásielku
                </a>
            </div>
        )}
      </div>

      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-bold mb-4">História stavov</h3>
          <ul className="space-y-2">
            {order.statusHistory.map((history, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-center">
                 <span className="font-semibold min-w-[120px]">{ORDER_STATUS_MAPPING[history.status] || history.status} &nbsp;</span>
                 <span className="text-gray-500">{new Date(history.createdAt).toLocaleString('sk-SK')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
           <h3 className="text-lg font-bold mb-2">Fakturačná adresa</h3>
           {order.invoiceAddress ? (
               <address className="not-italic text-sm text-gray-700">
                 {order.firstname} {order.lastname}<br/>
                 {order.invoiceAddress.street}<br/>
                 {order.invoiceAddress.zip} {order.invoiceAddress.city}
               </address>
           ) : (
             <p className="text-sm text-gray-500">Nezadaná</p>
           )}
        </div>
        <div>
           <h3 className="text-lg font-bold mb-2">Dodacia adresa</h3>
           {order.deliveryAddress ? (
               <address className="not-italic text-sm text-gray-700">
                 {order.deliveryAddressSameAsInvoiceAddress ? (
                      <>
                        {order.firstname} {order.lastname}<br/>
                        {order.invoiceAddress.street}<br/>
                        {order.invoiceAddress.zip} {order.invoiceAddress.city}
                      </>
                 ) : (
                      <>
                        {order.deliveryAddress.street}<br/>
                        {order.deliveryAddress.zip} {order.deliveryAddress.city}
                      </>
                 )}
               </address>
           ) : (
             <p className="text-sm text-gray-500">Nezadaná</p>
           )}
        </div>
      </div>

      <div className="mb-8 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <h3 className="text-lg font-bold mb-4 border-b border-gray-100 pb-2">Položky objednávky</h3>
        <div className="flex flex-col gap-4">
           {order.items && order.items.map((item) => (
             <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
               <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                 {item.image && (
                   <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                 )}
                 <div className="flex-1 min-w-0">
                     {item.slug || item.productSlug ? (
                       <Link to={`/produkt/${item.slug || item.productSlug}`} className="text-gray-900 hover:text-tany-green hover:underline font-medium block leading-tight">
                         {item.name}
                       </Link>
                     ) : (
                       <span className="text-gray-900 font-medium block leading-tight">{item.name}</span>
                     )}
                     {item.externalStock && (
                        <div className="text-xs text-tany-green mt-1">Skladom u dodávateľa</div>
                     )}
                     <div className="text-sm text-gray-500 mt-1">
                        Množstvo: {item.quantity}
                     </div>
                 </div>
               </div>
               <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-gray-50 sm:border-0">
                 <div className="text-sm text-gray-500">
                   {item.discountPrice ? (
                      <div className="flex flex-row sm:flex-col gap-2 sm:gap-0 items-center sm:items-end">
                          <span className="text-xs text-gray-400 line-through">{item.price?.toFixed(2)} € / ks</span>
                          <span className="text-red-600 font-semibold">{item.discountPrice.toFixed(2)} € / ks</span>
                      </div>
                   ) : (
                      <span>{item.price?.toFixed(2)} € / ks</span>
                   )}
                 </div>
                 <div className="font-bold text-gray-900 ml-4 sm:ml-0 sm:mt-1 text-lg">
                   {((item.discountPrice || item.price) * item.quantity).toFixed(2)} €
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-full md:w-1/2 lg:w-1/3">
           <div className="flex justify-between py-2 border-b border-gray-100">
             <span className="text-gray-600">Produkty spolu:</span>
             <span className="font-medium">
                {order.productsPrice ? order.productsPrice.toFixed(2) : '0.00'} €
             </span>
           </div>
           <div className="flex justify-between py-2 border-b border-gray-100">
             <span className="text-gray-600">Doprava:</span>
             <span className="font-medium">
                {deliveryPrice.toFixed(2)} €
             </span>
           </div>
           {discountItems.map((item, idx) => (
               <div key={idx} className="flex justify-between py-2 border-b border-gray-100 text-green-600">
                   <span>{item.name}:</span>
                   <span className="font-medium">{(item.priceWithVat * (item.quantity || 1)).toFixed(2)} €</span>
               </div>
           ))}
           <div className="flex justify-between py-2 border-b border-gray-100">
             <span className="text-gray-600">Cena bez DPH:</span>
             <span className="font-medium">
                {order.priceBreakDown && order.priceBreakDown.totalPriceWithoutVat
                    ? order.priceBreakDown.totalPriceWithoutVat.toFixed(2)
                    : (order.finalPrice ? (order.finalPrice / VAT_RATE).toFixed(2) : '0.00')} €
             </span>
           </div>
           <div className="flex justify-between py-4 text-lg font-bold">
             <span>Celkom k úhrade:</span>
             <span className="text-tany-green">
                {order.finalPrice ? order.finalPrice.toFixed(2) : '0.00'} €
             </span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetail;
