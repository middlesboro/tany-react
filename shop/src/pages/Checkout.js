import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import { createOrder } from '../services/orderService';
import { debounce } from '../utils/debounce';
import PriceBreakdown from '../components/PriceBreakdown';
import { isValidName, isValidSlovakPhone, isValidSlovakZip, isValidEmail, checkEmailTypos } from '../utils/validation';
import { VAT_RATE } from '../utils/constants';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, customer: customerContext, loading, clearCart, updateCart } = useCart();
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const { setBreadcrumbs } = useBreadcrumbs();
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
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(null);
  const [note, setNote] = useState('');

  // Track if we have initialized from cart to avoid overwriting user input
  // We use state instead of ref to ensure that after initialization, the component re-renders
  // and subsequent effects (like the auto-save) see the updated initialized value AND updated state.
  const [initialized, setInitialized] = useState(false);

  // Dynamic data from cart
  const carriers = cart?.carriers || [];
  const payments = cart?.payments || [];

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Domov', path: '/' },
      { label: 'Nákupný košík', path: '/cart' },
      { label: 'Objednávka', path: null }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const scriptId = 'packeta-widget-script';
    if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://widget.packeta.com/v6/www/js/library.js';
        script.async = true;
        document.body.appendChild(script);
    }
  }, []);

  // Initialize state from cart data
  useEffect(() => {
      if (cart && !initialized) {
          // Initialize Carriers
          if (cart.selectedCarrierId) {
              setSelectedCarrier(cart.selectedCarrierId);
          } else if (!selectedCarrier && cart.carriers) {
              const preSelectedCarrier = cart.carriers.find(c => c.selected);
              if (preSelectedCarrier) {
                  setSelectedCarrier(preSelectedCarrier.id);
              }
          }

          // Initialize Payments
          if (cart.selectedPaymentId) {
               setSelectedPayment(cart.selectedPaymentId);
          } else if (!selectedPayment && cart.payments) {
              const preSelectedPayment = cart.payments.find(p => p.selected);
              if (preSelectedPayment) {
                  setSelectedPayment(preSelectedPayment.id);
              }
          }

          const profile = customerContext || {};

          // Initialize Customer
          setCustomer(prev => ({
              firstname: cart.firstname || profile.firstname || prev.firstname,
              lastname: cart.lastname || profile.lastname || prev.lastname,
              email: cart.email || profile.email || prev.email,
              phone: cart.phone || profile.phone || prev.phone
          }));

          if (cart.note || cart.description) {
              setNote(cart.note || cart.description);
          }

          // Initialize Invoice Address
          const cartInvoice = cart.invoiceAddress || {};
          const profileInvoice = profile.invoiceAddress || {};

          setInvoiceAddress(prev => ({
              street: cartInvoice.street || profileInvoice.street || prev.street,
              city: cartInvoice.city || profileInvoice.city || prev.city,
              zip: cartInvoice.zip || profileInvoice.zip || prev.zip
          }));

          // Initialize Pickup Point
          if (cart.selectedPickupPointId) {
             setSelectedPickupPoint({
                 id: cart.selectedPickupPointId,
                 name: cart.selectedPickupPointName || "Uložené výdajné miesto"
             });
          }

          // Initialize Delivery Address
          const cartDelivery = cart.deliveryAddress || {};
          // Only use profile delivery address if it has data.
          // Typically profile.deliveryAddress is same as invoice unless specified.
          const profileDelivery = profile.deliveryAddress || {};

          // Check if cart has specific delivery address data
          const hasCartDeliveryData = cartDelivery.street || cartDelivery.city || cartDelivery.zip;

          if (hasCartDeliveryData) {
               setDeliveryAddress(prev => ({
                   street: cartDelivery.street || prev.street,
                   city: cartDelivery.city || prev.city,
                   zip: cartDelivery.zip || prev.zip
               }));

               // Check difference with whatever invoice address we settled on (cart or profile)
               // Note: 'invoiceAddress' state isn't updated yet in this render cycle, so we calculate what it will be.
               const targetInvoice = {
                    street: cartInvoice.street || profileInvoice.street || '',
                    city: cartInvoice.city || profileInvoice.city || '',
                    zip: cartInvoice.zip || profileInvoice.zip || ''
               };

               const isDifferent = cartDelivery.street !== targetInvoice.street ||
                                   cartDelivery.city !== targetInvoice.city ||
                                   cartDelivery.zip !== targetInvoice.zip;
               setDifferentDeliveryAddress(isDifferent);
          } else {
              // If cart doesn't have delivery data, check profile delivery data
              const hasProfileDeliveryData = profileDelivery.street || profileDelivery.city || profileDelivery.zip;

              if (hasProfileDeliveryData) {
                  setDeliveryAddress(prev => ({
                      street: profileDelivery.street || prev.street,
                      city: profileDelivery.city || prev.city,
                      zip: profileDelivery.zip || prev.zip
                  }));

                   // Check difference with invoice address
                   const targetInvoice = {
                        street: cartInvoice.street || profileInvoice.street || '',
                        city: cartInvoice.city || profileInvoice.city || '',
                        zip: cartInvoice.zip || profileInvoice.zip || ''
                   };

                   const isDifferent = profileDelivery.street !== targetInvoice.street ||
                                       profileDelivery.city !== targetInvoice.city ||
                                       profileDelivery.zip !== targetInvoice.zip;
                   setDifferentDeliveryAddress(isDifferent);
              }
          }

          setInitialized(true);
      }
  }, [cart, customerContext, selectedCarrier, selectedPayment, initialized]);

  // Debounced update function
  const debouncedUpdate = useCallback(
      debounce((data) => {
          if (data.cartId) {
             updateCart(data).catch(err => console.error("Auto-save failed", err));
          }
      }, 1000), // 1 second debounce
      [updateCart] // dependency on updateCart (stable from context)
  );

  // Effect to trigger update when fields change
  useEffect(() => {
      if (!initialized || !cart) return;

      const carrierObj = carriers.find(c => c.id === selectedCarrier);

      const dataToSave = {
          cartId: cart.cartId,
          firstname: customer.firstname,
          lastname: customer.lastname,
          email: customer.email,
          phone: customer.phone,
          note: note,
          description: note,
          invoiceAddress: invoiceAddress,
          deliveryAddress: differentDeliveryAddress ? deliveryAddress : invoiceAddress, // Send proper delivery address
          selectedCarrierId: selectedCarrier,
          selectedPaymentId: selectedPayment,
          selectedPickupPointId: carrierObj?.type === 'PACKETA' ? selectedPickupPoint?.id : null,
          selectedPickupPointName: carrierObj?.type === 'PACKETA' ? (selectedPickupPoint?.name || selectedPickupPoint?.formatedValue) : null
      };

      debouncedUpdate(dataToSave);

  }, [customer, invoiceAddress, deliveryAddress, differentDeliveryAddress, selectedCarrier, selectedPayment, selectedPickupPoint, note, cart?.cartId, debouncedUpdate, initialized]);


  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
    // Clear specific error when user types
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (warnings[name]) {
        setWarnings(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleInvoiceAddressChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'zip') {
        newValue = value.replace(/\s+/g, '');
    }
    setInvoiceAddress(prev => ({ ...prev, [name]: newValue }));

    const errorKey = `invoice_${name}`;
    if (errors[errorKey]) {
        setErrors(prev => ({ ...prev, [errorKey]: null }));
    }
  };

  const handleDeliveryAddressChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'zip') {
        newValue = value.replace(/\s+/g, '');
    }
    setDeliveryAddress(prev => ({ ...prev, [name]: newValue }));

    const errorKey = `delivery_${name}`;
    if (errors[errorKey]) {
        setErrors(prev => ({ ...prev, [errorKey]: null }));
    }
  };

  const validateField = (name, value, prefix = '') => {
      let error = null;
      let warning = null;
      const fieldName = prefix ? name.replace(`${prefix}_`, '') : name; // e.g., 'zip' from 'invoice_zip'

      // Map field name to validation logic
      // Note: 'firstname'/'lastname'/'email'/'phone' are direct names in customer object
      // 'street'/'city'/'zip' are in address objects, passed with prefix usually or handled by caller

      // We normalize the value check based on the field 'type' logic

      // Customer Fields
      if (name === 'firstname') {
          if (!isValidName(value)) error = "Meno môže obsahovať len písmená";
      } else if (name === 'lastname') {
          if (!isValidName(value)) error = "Priezvisko môže obsahovať len písmená";
      } else if (name === 'email') {
          if (!isValidEmail(value)) {
              error = "Neplatný formát emailu";
          } else {
              const typo = checkEmailTypos(value);
              if (typo) warning = typo;
          }
      } else if (name === 'phone') {
          if (!isValidSlovakPhone(value)) error = "Nesprávny formát (napr. +421944123456 alebo 0944123456)";
      }
      // Address Fields (prefix is 'invoice' or 'delivery')
      else if (name.endsWith('street')) {
           if (!value) error = "Ulica je povinná";
      } else if (name.endsWith('city')) {
           if (!value) error = "Mesto je povinné";
      } else if (name.endsWith('zip')) {
           if (!isValidSlovakZip(value)) error = "PSČ musí mať 5 číslic";
      }

      setErrors(prev => ({ ...prev, [name]: error }));
      setWarnings(prev => ({ ...prev, [name]: warning }));

      return !error;
  };

  const handleBlur = (e) => {
      const { name, value } = e.target;
      // Determine context for address fields
      // The inputs have names like "invoice_street" or just "street" depending on how I set them up.
      // In JSX below:
      // Customer: name="firstname", etc.
      // Invoice: name="street" (but handled by handleInvoiceAddressChange)
      // Wait, handleInvoiceAddressChange uses `name` from event. The input `name` is "street".
      // But `errors` state uses `invoice_street`.
      // So I need to pass the correct key to `validateField`.

      // I should update inputs to have unique names or handle the mapping here.
      // Current JSX:
      // Invoice: <input name="street" ... />
      // Delivery: <input name="street" ... />
      // This is problematic for `handleBlur` if I rely on `e.target.name` alone because both have name="street".
      // I should assume the section based on ... well, I can't know which section it is easily without unique names or ids.

      // I will update input names in JSX to be unique (e.g. "invoice_street") and handle that in change handlers.
      // OR, simpler: pass a wrapper to onBlur.
  };

  // Revised handlers to support unique names if I change them, OR just wrap onBlur.
  // Let's change input names in JSX to be explicit: 'invoice_street', 'delivery_street'.
  // And update change handlers to parse it.

  const calculateShippingPrice = (carrier) => {
    if (!carrier) return 0;
    // New API structure: price is directly on the carrier object
    if (typeof carrier.price === 'number') {
        return carrier.price;
    }
    // Fallback for old structure
    if (carrier.ranges && carrier.ranges.length > 0) {
        return carrier.ranges[0].price;
    }
    return 0;
  };

  const calculatePaymentPrice = (payment) => {
      if (!payment) return 0;
      return payment.price || 0;
  };

  const openPacketaWidget = () => {
      const packetaApiKey = 'XXX XXX XXX96cee6278e535aa508c6be174a4d6d03';
      const packetaOptions = {
          country: "sk",
          language: "sk",
          valueFormat: "\"Packeta\",id,carrierId,carrierPickupPointId,name,city,street",
          view: "modal"
      };

      if (window.Packeta && window.Packeta.Widget) {
          window.Packeta.Widget.pick(packetaApiKey, (point) => {
            if (point) {
                setSelectedPickupPoint(point);
            }
          }, packetaOptions);
      } else {
          console.error("Packeta widget script not loaded yet.");
          alert("Packeta widget is loading, please try again in a moment.");
      }
  };

  const validateForm = () => {
      const newErrors = {};
      const newWarnings = {};

      // Customer
      if (!isValidName(customer.firstname)) newErrors.firstname = "Meno môže obsahovať len písmená";
      if (!isValidName(customer.lastname)) newErrors.lastname = "Priezvisko môže obsahovať len písmená";
      if (!isValidEmail(customer.email)) {
          newErrors.email = "Neplatný formát emailu";
      } else {
          const typo = checkEmailTypos(customer.email);
          if (typo) newWarnings.email = typo;
      }
      if (!isValidSlovakPhone(customer.phone)) newErrors.phone = "Nesprávny formát (napr. +421944123456 alebo 0944123456)";

      // Invoice Address (Required)
      if (!invoiceAddress.street) newErrors.invoice_street = "Ulica je povinná";
      if (!invoiceAddress.city) newErrors.invoice_city = "Mesto je povinné";
      if (!isValidSlovakZip(invoiceAddress.zip)) newErrors.invoice_zip = "PSČ musí mať 5 číslic";

      // Delivery Address (Required if different)
      if (differentDeliveryAddress) {
          if (!deliveryAddress.street) newErrors.delivery_street = "Ulica je povinná";
          if (!deliveryAddress.city) newErrors.delivery_city = "Mesto je povinné";
          if (!isValidSlovakZip(deliveryAddress.zip)) newErrors.delivery_zip = "PSČ musí mať 5 číslic";
      }

      setErrors(newErrors);
      setWarnings(newWarnings);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        window.scrollTo(0, 0);
        return;
    }

    const carrierObj = carriers.find(c => c.id === selectedCarrier);
    const paymentObj = payments.find(p => p.id === selectedPayment);
    const shippingPrice = calculateShippingPrice(carrierObj);
    const paymentPrice = calculatePaymentPrice(paymentObj);

    if (carrierObj?.type === 'PACKETA' && !selectedPickupPoint) {
        alert("Prosím vyberte výdajné miesto.");
        return;
    }

    // cart.totalProductPrice comes from the API
    const productTotal = cart?.totalProductPrice || 0;
    const finalPrice = productTotal + shippingPrice + paymentPrice;

    const orderData = {
      cartId: cart?.cartId,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone,
      note: note,
      invoiceAddress,
      deliveryAddress: differentDeliveryAddress ? deliveryAddress : invoiceAddress,
      deliveryAddressSameAsInvoiceAddress: !differentDeliveryAddress,
      carrierId: selectedCarrier,
      paymentId: selectedPayment,
      finalPrice: finalPrice,
      selectedPickupPointId: carrierObj?.type === 'PACKETA' ? selectedPickupPoint?.id : null,
      items: cart?.products?.map(p => ({
        id: p.id,
        name: p.title,
        price: p.price,
        discountPrice: p.discountPrice,
        quantity: p.quantity,
        image: p.image
      })) || []
    };

    try {
      const createdOrder = await createOrder(orderData);
      clearCart();
      navigate(`/order/confirmation/${createdOrder.id}`, { state: { newOrder: true } });
    } catch (error) {
      console.error('Order creation failed', error);
      alert('Nepodarilo sa vytvoriť objednávku. Skúste to prosím znova.');
    }
  };

  if (loading) {
      return <div className="container mx-auto px-4 py-8">Načítavam pokladňu...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Objednávka</h1>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Carriers Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">1. DOPRAVA A PLATBA</h2>
          <div className="bg-white rounded shadow p-4 space-y-4">
             {carriers.length === 0 && <p>Žiadni dopravcovia nie sú k dispozícii.</p>}
             {carriers.map(carrier => {
                 const price = calculateShippingPrice(carrier);
                 const isPacketa = carrier.type === 'PACKETA';
                 const isSelected = selectedCarrier === carrier.id;

                 return (
                    <div key={carrier.id} className={`p-4 border rounded ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="carrier"
                                value={carrier.id}
                                checked={isSelected}
                                onChange={() => setSelectedCarrier(carrier.id)}
                                className="h-5 w-5 text-blue-600 mr-4"
                            />
                            <div className="flex-1">
                                <div className="font-bold">{carrier.name}</div>
                                <div className="text-sm text-gray-500">{carrier.description}</div>
                            </div>
                            <div className="font-bold whitespace-nowrap">
                                {price === 0 ? 'Zadarmo' : `${price.toFixed(2)} €`}
                            </div>
                        </label>
                        {isSelected && isPacketa && (
                            <div className="mt-4 pl-9">
                                <button
                                    type="button"
                                    onClick={openPacketaWidget}
                                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Vybrať výdajné miesto
                                </button>
                                {selectedPickupPoint && (
                                    <div className="mt-2 text-sm text-gray-700">
                                        <strong>Vybrané miesto:</strong> {selectedPickupPoint.name}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                 );
             })}
          </div>
        </section>

        {/* Payments Section */}
        {selectedCarrier && (
            <section>
            <h2 className="text-xl font-bold mb-4">2. SPÔSOB PLATBY</h2>
            <div className="bg-white rounded shadow p-4 space-y-4">
                {payments.length === 0 && <p>Žiadne platby nie sú k dispozícii.</p>}
                {payments.map(payment => {
                    const price = calculatePaymentPrice(payment);
                    return (
                        <label key={payment.id} className={`flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50 ${selectedPayment === payment.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value={payment.id}
                                checked={selectedPayment === payment.id}
                                onChange={() => setSelectedPayment(payment.id)}
                                className="h-5 w-5 text-blue-600 mr-4"
                            />
                            <div className="flex-1">
                                <div className="font-bold">{payment.name}</div>
                                <div className="text-sm text-gray-500">{payment.description}</div>
                            </div>
                            <div className="font-bold whitespace-nowrap">
                                {price === 0 ? 'Zadarmo' : `${price.toFixed(2)} €`}
                            </div>
                        </label>
                    );
                })}
            </div>
            </section>
        )}

        {/* Customer Details Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">3. FAKTURAČNÉ ÚDAJE</h2>
          <div className="bg-white rounded shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Meno</label>
                 <input
                    type="text"
                    name="firstname"
                    value={customer.firstname}
                    onChange={handleCustomerChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    required
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${errors.firstname ? 'border-red-500' : 'border-gray-300'}`}
                 />
                 {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Priezvisko</label>
                 <input
                    type="text"
                    name="lastname"
                    value={customer.lastname}
                    onChange={handleCustomerChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    required
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${errors.lastname ? 'border-red-500' : 'border-gray-300'}`}
                 />
                 {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                 <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    required
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                 />
                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                 {!errors.email && warnings.email && <p className="text-green-600 text-xs mt-1">{warnings.email}</p>}
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Telefón</label>
                 <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    required
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                 />
                 {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
             </div>
          </div>
        </section>

        {/* Invoice Address Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">4. FAKTURAČNÁ ADRESA</h2>
          <div className="bg-white rounded shadow p-6 space-y-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Ulica a číslo</label>
                 <input
                    type="text"
                    name="street"
                    value={invoiceAddress.street}
                    onChange={handleInvoiceAddressChange}
                    onBlur={(e) => validateField('invoice_street', e.target.value)}
                    required
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${errors.invoice_street ? 'border-red-500' : 'border-gray-300'}`}
                 />
                 {errors.invoice_street && <p className="text-red-500 text-xs mt-1">{errors.invoice_street}</p>}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesto</label>
                    <input
                        type="text"
                        name="city"
                        value={invoiceAddress.city}
                        onChange={handleInvoiceAddressChange}
                        onBlur={(e) => validateField('invoice_city', e.target.value)}
                        required
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${errors.invoice_city ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.invoice_city && <p className="text-red-500 text-xs mt-1">{errors.invoice_city}</p>}
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PSČ</label>
                    <input
                        type="text"
                        name="zip"
                        value={invoiceAddress.zip}
                        onChange={handleInvoiceAddressChange}
                        onBlur={(e) => validateField('invoice_zip', e.target.value)}
                        required
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${errors.invoice_zip ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.invoice_zip && <p className="text-red-500 text-xs mt-1">{errors.invoice_zip}</p>}
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
                    <span className="ml-2 text-gray-700">Doručiť na inú adresu</span>
                </label>
             </div>
          </div>
        </section>

        {/* Delivery Address Section */}
        {differentDeliveryAddress && (
            <section>
            <h2 className="text-xl font-bold mb-4">5. DORUČOVACIA ADRESA</h2>
            <div className="bg-white rounded shadow p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ulica a číslo</label>
                    <input
                        type="text"
                        name="street"
                        value={deliveryAddress.street}
                        onChange={handleDeliveryAddressChange}
                        onBlur={(e) => validateField('delivery_street', e.target.value)}
                        required={differentDeliveryAddress}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${errors.delivery_street ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.delivery_street && <p className="text-red-500 text-xs mt-1">{errors.delivery_street}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mesto</label>
                        <input
                            type="text"
                            name="city"
                            value={deliveryAddress.city}
                            onChange={handleDeliveryAddressChange}
                            onBlur={(e) => validateField('delivery_city', e.target.value)}
                            required={differentDeliveryAddress}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${errors.delivery_city ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.delivery_city && <p className="text-red-500 text-xs mt-1">{errors.delivery_city}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PSČ</label>
                        <input
                            type="text"
                            name="zip"
                            value={deliveryAddress.zip}
                            onChange={handleDeliveryAddressChange}
                            onBlur={(e) => validateField('delivery_zip', e.target.value)}
                            required={differentDeliveryAddress}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${errors.delivery_zip ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.delivery_zip && <p className="text-red-500 text-xs mt-1">{errors.delivery_zip}</p>}
                    </div>
                </div>
            </div>
            </section>
        )}

        {/* Note Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">6. POZNÁMKA</h2>
          <div className="bg-white rounded shadow p-6">
             <label className="block text-sm font-medium text-gray-700 mb-1">Poznámka k objednávke</label>
             <textarea
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                rows="4"
             />
          </div>
        </section>

        {/* Price Breakdown */}
        <section>
            <h2 className="text-xl font-bold mb-4">7. SÚHRN</h2>
            <div className="bg-white rounded shadow p-6">
                {cart?.priceBreakDown ? (
                   <PriceBreakdown priceBreakDown={cart.priceBreakDown} showItems={true} cartItems={cart.products} />
                ) : (
                    <div className="w-full">
                        <div className="space-y-2 text-sm text-gray-600">
                             {/* Items Fallback - basic list */}
                             {cart?.products?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center mb-2">
                                     <div className="flex items-center">
                                         <span>{item.title} {item.quantity > 1 ? `(${item.quantity} ks)` : ''}</span>
                                     </div>
                                     <span>{(item.price * item.quantity).toFixed(2)} €</span>
                                </div>
                             ))}
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                             <div className="flex justify-between items-end">
                                 <span className="text-base font-bold text-gray-900">Spolu (produkty):</span>
                                 <div className="text-right">
                                     <span className="block text-xl font-bold text-blue-600">
                                         {cart?.totalProductPrice ? cart.totalProductPrice.toFixed(2) : '0.00'} €
                                     </span>
                                 </div>
                             </div>
                             <div className="flex justify-between text-xs text-gray-500 mt-1">
                                 <span>Bez DPH: {cart?.totalProductPrice ? (cart.totalProductPrice / VAT_RATE).toFixed(2) : '0.00'} €</span>
                             </div>
                        </div>
                   </div>
                )}
            </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
            <button
                type="submit"
                className="bg-green-600 text-white font-bold py-3 px-8 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedCarrier || !selectedPayment}
            >
                Dokončiť objednávku
            </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
