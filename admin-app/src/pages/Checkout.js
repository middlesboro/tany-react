import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart } = useCart();
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [customer, setCustomer] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });
  const [invoiceAddress, setInvoiceAddress] = useState({
    street: '',
    city: '',
    zip: '',
  });
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    zip: '',
  });
  const [differentDeliveryAddress, setDifferentDeliveryAddress] = useState(false);

  const carriers = [
    { id: 'pickup_senec', name: 'Osobný odber - isklad Diaľničná cesta 5, Senec', price: 1.02, freeLimit: 30, desc: 'Doprava zadarmo od 30€. Slúži len ako odberné miesto.' },
    { id: 'pickup_packeta', name: 'Osobný odber – Zásielkovňa', price: 2.56, freeLimit: 35, desc: 'Doprava zadarmo od 35€' },
    { id: 'post_office', name: 'Slovenská pošta - Balík na poštu', price: 3.28, freeLimit: 40, desc: 'Doprava zadarmo od 40€' },
    { id: 'courier', name: 'Kuriér na adresu', price: 3.89, freeLimit: 60, desc: 'Doprava zadarmo od 60€' },
  ];

  const payments = [
    { id: 'card', name: 'Card payment online' },
    { id: 'transfer', name: 'Bank transfer' },
    { id: 'cod', name: 'Cash on delivery' },
  ];

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleInvoiceAddressChange = (e) => {
    const { name, value } = e.target;
    setInvoiceAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliveryAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const calculateShippingPrice = (carrier) => {
    if (!carrier) return 0;
    const total = cart?.totalPrice || 0;
    if (total >= carrier.freeLimit) return 0;
    return carrier.price;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      cartId: cart?.id,
      customer,
      invoiceAddress,
      deliveryAddress: differentDeliveryAddress ? deliveryAddress : invoiceAddress,
      carrier: selectedCarrier,
      payment: selectedPayment,
      shippingPrice: calculateShippingPrice(carriers.find(c => c.id === selectedCarrier)),
      totalPrice: (cart?.totalPrice || 0) + calculateShippingPrice(carriers.find(c => c.id === selectedCarrier))
    };
    console.log('Order Submitted:', orderData);
    alert('Order submitted (check console for details). Confirmation page coming soon!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Carriers Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">1. DOPRAVA A PLATBA</h2>
          <div className="bg-white rounded shadow p-4 space-y-4">
             {carriers.map(carrier => {
                 const price = calculateShippingPrice(carrier);
                 return (
                    <label key={carrier.id} className={`flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50 ${selectedCarrier === carrier.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <input
                            type="radio"
                            name="carrier"
                            value={carrier.id}
                            checked={selectedCarrier === carrier.id}
                            onChange={() => setSelectedCarrier(carrier.id)}
                            className="h-5 w-5 text-blue-600 mr-4"
                        />
                        <div className="flex-1">
                            <div className="font-bold">{carrier.name}</div>
                            <div className="text-sm text-gray-500">{carrier.desc}</div>
                        </div>
                        <div className="font-bold whitespace-nowrap">
                            {price === 0 ? 'Free' : `${price.toFixed(2)} €`}
                        </div>
                    </label>
                 );
             })}
          </div>
        </section>

        {/* Payments Section */}
        {selectedCarrier && (
            <section>
            <h2 className="text-xl font-bold mb-4">2. PAYMENT METHOD</h2>
            <div className="bg-white rounded shadow p-4 space-y-4">
                {payments.map(payment => (
                    <label key={payment.id} className={`flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50 ${selectedPayment === payment.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <input
                            type="radio"
                            name="payment"
                            value={payment.id}
                            checked={selectedPayment === payment.id}
                            onChange={() => setSelectedPayment(payment.id)}
                            className="h-5 w-5 text-blue-600 mr-4"
                        />
                        <div className="font-bold">{payment.name}</div>
                    </label>
                ))}
            </div>
            </section>
        )}

        {/* Customer Details Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">3. CUSTOMER DETAILS</h2>
          <div className="bg-white rounded shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                 <input
                    type="text"
                    name="firstname"
                    value={customer.firstname}
                    onChange={handleCustomerChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                 />
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                 <input
                    type="text"
                    name="lastname"
                    value={customer.lastname}
                    onChange={handleCustomerChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                 />
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                 <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                 />
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                 <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                 />
             </div>
          </div>
        </section>

        {/* Invoice Address Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">4. INVOICE ADDRESS</h2>
          <div className="bg-white rounded shadow p-6 space-y-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Street and Number</label>
                 <input
                    type="text"
                    name="street"
                    value={invoiceAddress.street}
                    onChange={handleInvoiceAddressChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                 />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                        type="text"
                        name="city"
                        value={invoiceAddress.city}
                        onChange={handleInvoiceAddressChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                        type="text"
                        name="zip"
                        value={invoiceAddress.zip}
                        onChange={handleInvoiceAddressChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                 </div>
             </div>

             <div className="pt-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={differentDeliveryAddress}
                        onChange={(e) => setDifferentDeliveryAddress(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Delivery address is different from invoice address</span>
                </label>
             </div>
          </div>
        </section>

        {/* Delivery Address Section */}
        {differentDeliveryAddress && (
            <section>
            <h2 className="text-xl font-bold mb-4">5. DELIVERY ADDRESS</h2>
            <div className="bg-white rounded shadow p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street and Number</label>
                    <input
                        type="text"
                        name="street"
                        value={deliveryAddress.street}
                        onChange={handleDeliveryAddressChange}
                        required={differentDeliveryAddress}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={deliveryAddress.city}
                            onChange={handleDeliveryAddressChange}
                            required={differentDeliveryAddress}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                            type="text"
                            name="zip"
                            value={deliveryAddress.zip}
                            onChange={handleDeliveryAddressChange}
                            required={differentDeliveryAddress}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
            </section>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
            <button
                type="submit"
                className="bg-green-600 text-white font-bold py-3 px-8 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedCarrier || !selectedPayment}
            >
                Complete Order
            </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
