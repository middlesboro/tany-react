import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import { createOrder } from '../services/orderService';
import { debounce } from '../utils/debounce';
import { isValidName, isValidSlovakPhone, isValidSlovakZip, isValidEmail, checkEmailTypos } from '../utils/validation';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, customer: customerContext, loading, clearCart, updateCart } = useCart();
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const { setBreadcrumbs } = useBreadcrumbs();
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const selectedCarrierRef = useRef(null);
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

  // Use a map to store pickup points for each carrier: { [carrierId]: pointData }
  const [pickupPointMap, setPickupPointMap] = useState({});

  const [note, setNote] = useState('');

  const [initialized, setInitialized] = useState(false);

  // Dynamic data from cart
  const carriers = cart?.carriers || [];
  const payments = cart?.payments || [];

  useEffect(() => {
      selectedCarrierRef.current = selectedCarrier;
  }, [selectedCarrier]);

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

    const spsScriptId = 'sps-widget-script';
    if (!document.getElementById(spsScriptId)) {
        const script = document.createElement('script');
        script.id = spsScriptId;
        script.src = 'https://balikomat.sps-sro.sk/widget/v1/widget/js/widget.js';
        script.async = true;
        document.body.appendChild(script);
    }

    window.handleSPSPickupPoint = (point) => {
        if (point) {
            const currentCarrierId = selectedCarrierRef.current;
            if (currentCarrierId) {
                setPickupPointMap(prev => ({
                    ...prev,
                    [currentCarrierId]: {
                        id: point.id,
                        name: point.description || point.address,
                        street: point.address,
                        city: point.city,
                        zip: point.zip,
                        country: point.countryISO,
                        type: point.type
                    }
                }));
                setErrors(prev => ({ ...prev, pickupPoint: null }));
            }
        }
    };

    return () => {
        delete window.handleSPSPickupPoint;
    };
  }, []);

  // Initialize state from cart data
  useEffect(() => {
      if (cart && !initialized) {
          let initialCarrierId = null;
          if (cart.selectedCarrierId) {
              initialCarrierId = cart.selectedCarrierId;
              setSelectedCarrier(initialCarrierId);
          } else if (!selectedCarrier && cart.carriers) {
              const preSelectedCarrier = cart.carriers.find(c => c.selected);
              if (preSelectedCarrier) {
                  initialCarrierId = preSelectedCarrier.id;
                  setSelectedCarrier(initialCarrierId);
              }
          }

          if (cart.selectedPaymentId) {
               setSelectedPayment(cart.selectedPaymentId);
          } else if (!selectedPayment && cart.payments) {
              const preSelectedPayment = cart.payments.find(p => p.selected);
              if (preSelectedPayment) {
                  setSelectedPayment(preSelectedPayment.id);
              }
          }

          const profile = customerContext || {};

          setCustomer(prev => ({
              firstname: cart.firstname || profile.firstname || prev.firstname,
              lastname: cart.lastname || profile.lastname || prev.lastname,
              email: cart.email || profile.email || prev.email,
              phone: cart.phone || profile.phone || prev.phone
          }));

          if (cart.note || cart.description) {
              setNote(cart.note || cart.description);
          }

          const cartInvoice = cart.invoiceAddress || {};
          const profileInvoice = profile.invoiceAddress || {};

          setInvoiceAddress(prev => ({
              street: cartInvoice.street || profileInvoice.street || prev.street,
              city: cartInvoice.city || profileInvoice.city || prev.city,
              zip: cartInvoice.zip || profileInvoice.zip || prev.zip
          }));

          if (cart.selectedPickupPointId && initialCarrierId) {
             setPickupPointMap(prev => ({
                 ...prev,
                 [initialCarrierId]: {
                     id: cart.selectedPickupPointId,
                     name: cart.selectedPickupPointName || "Uložené výdajné miesto"
                 }
             }));
          }

          const cartDelivery = cart.deliveryAddress || {};
          const profileDelivery = profile.deliveryAddress || {};
          const hasCartDeliveryData = cartDelivery.street || cartDelivery.city || cartDelivery.zip;

          if (hasCartDeliveryData) {
               setDeliveryAddress(prev => ({
                   street: cartDelivery.street || prev.street,
                   city: cartDelivery.city || prev.city,
                   zip: cartDelivery.zip || prev.zip
               }));

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
              const hasProfileDeliveryData = profileDelivery.street || profileDelivery.city || profileDelivery.zip;

              if (hasProfileDeliveryData) {
                  setDeliveryAddress(prev => ({
                      street: profileDelivery.street || prev.street,
                      city: profileDelivery.city || prev.city,
                      zip: profileDelivery.zip || prev.zip
                  }));

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

  const debouncedUpdate = useCallback(
      debounce((data) => {
          if (data.cartId) {
             updateCart(data).catch(err => console.error("Auto-save failed", err));
          }
      }, 1000),
      [updateCart]
  );

  const debouncedUpdateRef = useRef(debouncedUpdate);
  useEffect(() => {
    debouncedUpdateRef.current = debouncedUpdate;
  }, [debouncedUpdate]);

  useEffect(() => {
    return () => {
      if (debouncedUpdateRef.current && debouncedUpdateRef.current.flush) {
        debouncedUpdateRef.current.flush();
      }
    };
  }, []);

  useEffect(() => {
      if (!initialized || !cart) return;

      const carrierObj = carriers.find(c => c.id === selectedCarrier);
      const currentPickupPoint = pickupPointMap[selectedCarrier];

      const dataToSave = {
          cartId: cart.cartId,
          firstname: customer.firstname,
          lastname: customer.lastname,
          email: customer.email,
          phone: customer.phone,
          note: note,
          description: note,
          invoiceAddress: invoiceAddress,
          deliveryAddress: differentDeliveryAddress ? deliveryAddress : invoiceAddress,
          selectedCarrierId: selectedCarrier,
          selectedPaymentId: selectedPayment,
          selectedPickupPointId: (carrierObj?.type === 'PACKETA' || carrierObj?.type === 'BALIKOVO') ? currentPickupPoint?.id : null,
          selectedPickupPointName: (carrierObj?.type === 'PACKETA' || carrierObj?.type === 'BALIKOVO') ? (currentPickupPoint?.name || currentPickupPoint?.formatedValue) : null,
          discountForNewsletter: cart.discountForNewsletter
      };

      debouncedUpdate(dataToSave);

  }, [customer, invoiceAddress, deliveryAddress, differentDeliveryAddress, selectedCarrier, selectedPayment, pickupPointMap, note, cart?.cartId, debouncedUpdate, initialized]);


  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
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

  const calculateShippingPrice = (carrier) => {
    if (!carrier) return 0;
    if (typeof carrier.price === 'number') {
        return carrier.price;
    }
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
                setPickupPointMap(prev => ({
                    ...prev,
                    [selectedCarrier]: point
                }));
                setErrors(prev => ({ ...prev, pickupPoint: null }));
            }
          }, packetaOptions);
      } else {
          console.error("Packeta widget script not loaded yet.");
          alert("Packeta widget is loading, please try again in a moment.");
      }
  };

  const openBalikovoWidget = () => {
      const SPSwidget = window.SPSwidget || {};
      window.SPSwidget = SPSwidget;

      SPSwidget.config = SPSwidget.config || {};
      SPSwidget.config.callback = "handleSPSPickupPoint";
      SPSwidget.config.country = "sk";

      if (SPSwidget.showMap) {
          SPSwidget.showMap();
      } else {
          console.error("SPS widget script not loaded yet.");
          alert("Balikovo widget is loading, please try again in a moment.");
      }
  };

  const validateForm = () => {
      const newErrors = {};
      const newWarnings = {};

      if (!isValidName(customer.firstname)) newErrors.firstname = "Meno môže obsahovať len písmená";
      if (!isValidName(customer.lastname)) newErrors.lastname = "Priezvisko môže obsahovať len písmená";
      if (!isValidEmail(customer.email)) {
          newErrors.email = "Neplatný formát emailu";
      } else {
          const typo = checkEmailTypos(customer.email);
          if (typo) newWarnings.email = typo;
      }
      if (!isValidSlovakPhone(customer.phone)) newErrors.phone = "Nesprávny formát (napr. +421944123456 alebo 0944123456)";

      if (!invoiceAddress.street) newErrors.invoice_street = "Ulica je povinná";
      if (!invoiceAddress.city) newErrors.invoice_city = "Mesto je povinné";
      if (!isValidSlovakZip(invoiceAddress.zip)) newErrors.invoice_zip = "PSČ musí mať 5 číslic";

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
    const currentPickupPoint = pickupPointMap[selectedCarrier];

    if ((carrierObj?.type === 'PACKETA' || carrierObj?.type === 'BALIKOVO') && !currentPickupPoint) {
        setErrors(prev => ({ ...prev, pickupPoint: "Musíte vybrať výdajné miesto" }));
        const carrierElement = document.getElementById(`carrier-${selectedCarrier}`);
        if (carrierElement) {
            carrierElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

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
      selectedPickupPointId: (carrierObj?.type === 'PACKETA' || carrierObj?.type === 'BALIKOVO') ? currentPickupPoint?.id : null,
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
      return <div className="checkout-page"><div className="container">Načítavam pokladňu...</div></div>;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Objednávka</h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* Step 1: Osobné údaje */}
          <div className="card">
            <h2><span className="step">1</span> Osobné údaje</h2>
            <div className="grid">
              <div>
                <label>Meno</label>
                <input
                    type="text"
                    name="firstname"
                    value={customer.firstname}
                    onChange={handleCustomerChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                />
                {errors.firstname && <div className="error-msg">{errors.firstname}</div>}
              </div>
              <div>
                <label>Priezvisko</label>
                <input
                    type="text"
                    name="lastname"
                    value={customer.lastname}
                    onChange={handleCustomerChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                />
                {errors.lastname && <div className="error-msg">{errors.lastname}</div>}
              </div>
              <div className="grid-1">
                <label>Telefón</label>
                <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                />
                {errors.phone && <div className="error-msg">{errors.phone}</div>}
              </div>
              <div className="grid-1">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                />
                {errors.email && <div className="error-msg">{errors.email}</div>}
                {!errors.email && warnings.email && <div className="text-green-600 text-xs mt-1">{warnings.email}</div>}
              </div>
            </div>
          </div>

          {/* Step 2: Fakturačná adresa */}
          <div className="card">
            <h2><span className="step">2</span> Fakturačná adresa</h2>
            <div className="grid">
              <div className="grid-1">
                <label>Ulica a číslo</label>
                <input
                    type="text"
                    name="street"
                    value={invoiceAddress.street}
                    onChange={handleInvoiceAddressChange}
                    onBlur={(e) => validateField('invoice_street', e.target.value)}
                />
                {errors.invoice_street && <div className="error-msg">{errors.invoice_street}</div>}
              </div>
              <div>
                <label>Mesto</label>
                <input
                    type="text"
                    name="city"
                    value={invoiceAddress.city}
                    onChange={handleInvoiceAddressChange}
                    onBlur={(e) => validateField('invoice_city', e.target.value)}
                />
                {errors.invoice_city && <div className="error-msg">{errors.invoice_city}</div>}
              </div>
              <div>
                <label>PSČ</label>
                <input
                    type="text"
                    name="zip"
                    value={invoiceAddress.zip}
                    onChange={handleInvoiceAddressChange}
                    onBlur={(e) => validateField('invoice_zip', e.target.value)}
                />
                {errors.invoice_zip && <div className="error-msg">{errors.invoice_zip}</div>}
              </div>
            </div>

            <div className="mt-16">
                <label className="option checkbox-label">
                   <input
                        type="checkbox"
                        checked={differentDeliveryAddress}
                        onChange={(e) => setDifferentDeliveryAddress(e.target.checked)}
                        className="checkbox-input"
                   />
                   <span>Doručiť na inú adresu</span>
                </label>
            </div>

            {differentDeliveryAddress && (
              <div className="grid mt-16">
                 <div className="grid-1">
                    <label>Ulica a číslo (Doručovacia)</label>
                    <input
                        type="text"
                        name="street"
                        value={deliveryAddress.street}
                        onChange={handleDeliveryAddressChange}
                        onBlur={(e) => validateField('delivery_street', e.target.value)}
                    />
                    {errors.delivery_street && <div className="error-msg">{errors.delivery_street}</div>}
                 </div>
                 <div>
                    <label>Mesto</label>
                    <input
                        type="text"
                        name="city"
                        value={deliveryAddress.city}
                        onChange={handleDeliveryAddressChange}
                        onBlur={(e) => validateField('delivery_city', e.target.value)}
                    />
                    {errors.delivery_city && <div className="error-msg">{errors.delivery_city}</div>}
                 </div>
                 <div>
                    <label>PSČ</label>
                    <input
                        type="text"
                        name="zip"
                        value={deliveryAddress.zip}
                        onChange={handleDeliveryAddressChange}
                        onBlur={(e) => validateField('delivery_zip', e.target.value)}
                    />
                    {errors.delivery_zip && <div className="error-msg">{errors.delivery_zip}</div>}
                 </div>
              </div>
            )}
          </div>

          {/* Step 3: Platba & doprava */}
          <div className="card">
            <h2><span className="step">3</span> Platba & doprava</h2>

            {/* Carriers */}
            {carriers.map(carrier => {
                 const price = calculateShippingPrice(carrier);
                 const isPacketa = carrier.type === 'PACKETA';
                 const isBalikovo = carrier.type === 'BALIKOVO';
                 const isSelected = selectedCarrier === carrier.id;
                 const currentPickupPoint = pickupPointMap[carrier.id];

                 return (
                    <div key={carrier.id} id={`carrier-${carrier.id}`}>
                        <label className={`option ${isSelected ? 'active-option' : ''}`}>
                            <div className="flex-row">
                                <input
                                    type="radio"
                                    name="carrier"
                                    value={carrier.id}
                                    checked={isSelected}
                                    onChange={() => {
                                        if (selectedCarrier !== carrier.id) {
                                            setSelectedCarrier(carrier.id);
                                        }
                                    }}
                                />
                                <div>
                                    <div className="font-bold">{carrier.name}</div>
                                    {carrier.description && <div className="muted">{carrier.description}</div>}
                                </div>
                            </div>
                            <strong>{price === 0 ? 'Zadarmo' : `${price.toFixed(2)} €`}</strong>
                        </label>

                        {isSelected && (isPacketa || isBalikovo) && (
                            <div className="packeta-container">
                                <button
                                    type="button"
                                    onClick={isPacketa ? openPacketaWidget : openBalikovoWidget}
                                    className="packeta-btn"
                                >
                                    Vybrať výdajné miesto
                                </button>
                                {errors.pickupPoint && (
                                    <div className="error-msg mt-2">{errors.pickupPoint}</div>
                                )}
                                {currentPickupPoint && (
                                    <div className="packeta-info">
                                        <strong>Vybrané miesto:</strong> {currentPickupPoint.name}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                 );
            })}

            <div className="spacer-20"></div>

            {/* Payments */}
            {selectedCarrier && payments.map(payment => {
                 const price = calculatePaymentPrice(payment);
                 const isSelected = selectedPayment === payment.id;

                 return (
                    <label key={payment.id} className={`option ${isSelected ? 'active-option' : ''}`}>
                        <div className="flex-row">
                            <input
                                type="radio"
                                name="payment"
                                value={payment.id}
                                checked={isSelected}
                                onChange={() => setSelectedPayment(payment.id)}
                            />
                            <div>
                                <div className="font-bold">{payment.name}</div>
                                {payment.description && <div className="muted">{payment.description}</div>}
                            </div>
                        </div>
                        <strong>{price === 0 ? 'Zadarmo' : `${price.toFixed(2)} €`}</strong>
                    </label>
                 );
            })}
          </div>

          {/* Note Section */}
          <div className="card">
             <h2>Poznámka</h2>
             <textarea
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="3"
             />
          </div>

          {/* Summary */}
          <div className="card">
            <h2>Zhrnutie objednávky</h2>

            {cart?.products?.map((item, index) => {
                const image = item.image || (item.images && item.images[0]) || 'https://via.placeholder.com/64';
                const total = item.price * item.quantity;
                return (
                    <div className="product" key={index}>
                      <img src={image} alt={item.title} />
                      <div className="flex-1">
                        <strong className="block">{item.title}</strong>
                        <div className="muted">{item.quantity} ks</div>
                      </div>
                      <strong>{total.toFixed(2)} €</strong>
                    </div>
                );
            })}

            <div className="separator"></div>

            {cart?.priceBreakDown?.items.filter(i => i.type !== 'PRODUCT').map((item, idx) => (
                <div className="summary-item" key={idx}>
                  <span>{item.name}</span>
                  <span>{(item.priceWithVat * item.quantity).toFixed(2)} €</span>
                </div>
            ))}

            <div className="summary-total">
              <span>Spolu</span>
              <span>{(cart?.priceBreakDown?.totalPrice || 0).toFixed(2)} €</span>
            </div>
            <div className="muted vat-info">
                Bez DPH: {(cart?.priceBreakDown?.totalPriceWithoutVat || 0).toFixed(2)} € · DPH: {(cart?.priceBreakDown?.totalPriceVatValue || 0).toFixed(2)} €
            </div>

            <button className="btn" type="submit" disabled={!selectedCarrier || !selectedPayment}>
                Dokončiť objednávku
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
