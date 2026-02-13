import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID;
const GOOGLE_ADS_CONVERSION_LABEL = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL;

// Helper to check if analytics are initialized
const isGaInitialized = () => ReactGA.isInitialized;
const isAdsInitialized = () => typeof window !== 'undefined' && typeof window.gtag === 'function';

export const initGA = () => {
    // Check if ID is present to avoid errors in dev/test if missing
    if (GA_MEASUREMENT_ID && !ReactGA.isInitialized) {
        ReactGA.initialize(GA_MEASUREMENT_ID);
    }
};

export const initGoogleAds = () => {
    if (GOOGLE_ADS_ID && typeof window !== 'undefined') {
        // Inject gtag script if not present
        const scriptId = 'google-ads-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
            document.head.appendChild(script);
        }

        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        // Ensure gtag is available on window if not already
        if (!window.gtag) {
            window.gtag = gtag;
        }
        // Config Google Ads
        window.gtag('config', GOOGLE_ADS_ID);
    }
};

export const logGoogleAdsConversion = (order) => {
    if (isAdsInitialized() && GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL) {
        window.gtag('event', 'conversion', {
            'send_to': `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
            'value': order.priceBreakDown?.totalPrice || order.finalPrice,
            'currency': 'EUR',
            'transaction_id': order.orderIdentifier || order.id
        });
    }
};

export const logGoogleAdsRemarketing = (eventName, params) => {
    if (isAdsInitialized() && GOOGLE_ADS_ID) {
        window.gtag('event', eventName, {
            'send_to': GOOGLE_ADS_ID,
            ...params
        });
    }
};

export const logPageView = () => {
    if (isGaInitialized()) {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
    }
};

// Generic event logging
export const logEvent = (category, action, label) => {
    if (isGaInitialized()) {
        ReactGA.event({ category, action, label });
    }
};

// Ecommerce Events

/**
 * view_item_list
 * @param {Array} items - Array of product objects
 * @param {string} listName - Name of the list (e.g., category name)
 */
export const logViewItemList = (items, listName) => {
    if (isGaInitialized()) {
        ReactGA.event("view_item_list", {
            item_list_id: listName,
            item_list_name: listName,
            items: items.map((item, index) => ({
                item_id: item.id || item.productId,
                item_name: item.title || item.productName,
                price: item.discountPrice || item.price,
                index: index,
                item_category: item.categoryTitle // if available
            }))
        });
    }
};

/**
 * view_item
 * @param {Object} item - Product object
 */
export const logViewItem = (item) => {
    if (isGaInitialized()) {
        ReactGA.event("view_item", {
            currency: "EUR",
            value: item.discountPrice || item.price,
            items: [{
                item_id: item.id,
                item_name: item.title,
                price: item.discountPrice || item.price,
                item_category: item.categoryTitle || (item.category ? item.category.title : undefined)
            }]
        });
    }

    // Google Ads Remarketing
    logGoogleAdsRemarketing('view_item', {
        ecomm_prodid: item.id || item.productId,
        ecomm_totalvalue: item.discountPrice || item.price,
        ecomm_pagetype: 'product',
        items: [{
            id: item.id || item.productId,
            google_business_vertical: 'retail'
        }]
    });
};

/**
 * select_item
 * @param {Object} item - Product object
 */
export const logSelectItem = (item) => {
    if (isGaInitialized()) {
        ReactGA.event("select_item", {
            item_list_id: "general_list", // You might want to pass this if you know where it came from
            item_list_name: "General List",
            items: [{
                item_id: item.id,
                item_name: item.title,
                price: item.discountPrice || item.price
            }]
        });
    }
};

/**
 * search
 * @param {string} searchTerm
 */
export const logSearch = (searchTerm) => {
    if (isGaInitialized()) {
        ReactGA.event("search", {
            search_term: searchTerm
        });
    }
};

/**
 * add_to_cart
 * @param {Object} item - Product object
 * @param {number} quantity
 */
export const logAddToCart = (item, quantity = 1) => {
    if (isGaInitialized()) {
        ReactGA.event("add_to_cart", {
            currency: "EUR",
            value: (item.discountPrice || item.price) * quantity,
            items: [{
                item_id: item.id || item.productId,
                item_name: item.title || item.productName,
                price: item.discountPrice || item.price,
                quantity: quantity
            }]
        });
    }
};

/**
 * view_cart
 * @param {Object} cart - Cart object
 */
export const logViewCart = (cart) => {
    if (isGaInitialized()) {
        const items = cart.items || cart.products || [];
        const value = cart.finalPrice !== undefined ? cart.finalPrice : (cart.totalProductPrice || 0);

        ReactGA.event("view_cart", {
            currency: "EUR",
            value: value,
            items: items.map(item => ({
                item_id: item.id || item.productId,
                item_name: item.title || item.productName || item.name,
                price: item.discountPrice || item.price,
                quantity: item.quantity
            }))
        });
    }
};

/**
 * remove_from_cart
 * @param {Object} item - Cart item object
 */
export const logRemoveFromCart = (item) => {
    if (isGaInitialized()) {
        ReactGA.event("remove_from_cart", {
            currency: "EUR",
            value: (item.discountPrice || item.price) * item.quantity,
            items: [{
                item_id: item.id || item.productId,
                item_name: item.title || item.productName || item.name,
                price: item.discountPrice || item.price,
                quantity: item.quantity
            }]
        });
    }
};

/**
 * add_to_wishlist
 * @param {Object} item - Product object
 */
export const logAddToWishlist = (item) => {
    if (isGaInitialized()) {
        ReactGA.event("add_to_wishlist", {
            currency: "EUR",
            value: item.discountPrice || item.price,
            items: [{
                item_id: item.id,
                item_name: item.title,
                price: item.discountPrice || item.price
            }]
        });
    }
};

/**
 * begin_checkout
 * @param {Object} cart - Cart object
 */
export const logBeginCheckout = (cart) => {
    if (isGaInitialized()) {
        const items = cart.items || cart.products || [];
        const value = cart.finalPrice !== undefined ? cart.finalPrice : (cart.totalProductPrice || 0);

        ReactGA.event("begin_checkout", {
            currency: "EUR",
            value: value,
            items: items.map(item => ({
                item_id: item.id || item.productId,
                item_name: item.title || item.productName || item.name,
                price: item.discountPrice || item.price,
                quantity: item.quantity
            }))
        });
    }
};

/**
 * add_shipping_info
 * @param {Object} carrier - Carrier object
 * @param {Object} cart - Cart object (for context)
 */
export const logAddShippingInfo = (carrier, cart) => {
    if (isGaInitialized()) {
        const items = cart.items || cart.products || [];
        const value = cart.finalPrice !== undefined ? cart.finalPrice : (cart.totalProductPrice || 0);

        ReactGA.event("add_shipping_info", {
            currency: "EUR",
            value: value,
            shipping_tier: carrier.name,
            items: items.map(item => ({
                item_id: item.id || item.productId,
                item_name: item.title || item.productName || item.name,
                price: item.discountPrice || item.price,
                quantity: item.quantity
            }))
        });
    }
};

/**
 * add_payment_info
 * @param {Object} payment - Payment object
 * @param {Object} cart - Cart object (for context)
 */
export const logAddPaymentInfo = (payment, cart) => {
    if (isGaInitialized()) {
        const items = cart.items || cart.products || [];
        const value = cart.finalPrice !== undefined ? cart.finalPrice : (cart.totalProductPrice || 0);

        ReactGA.event("add_payment_info", {
            currency: "EUR",
            value: value,
            payment_type: payment.name,
            items: items.map(item => ({
                item_id: item.id || item.productId,
                item_name: item.title || item.productName || item.name,
                price: item.discountPrice || item.price,
                quantity: item.quantity
            }))
        });
    }
};

/**
 * purchase
 * @param {Object} order - Order object
 */
export const logPurchase = (order) => {
    // items mapping might differ based on order structure
    const items = order.items || [];

    if (isGaInitialized()) {
        ReactGA.event("purchase", {
            transaction_id: order.orderIdentifier || order.id,
            value: order.finalPrice || order.priceBreakDown?.totalPrice,
            tax: order.priceBreakDown?.totalPriceVatValue,
            shipping: order.priceBreakDown?.items.find(i => i.type === 'CARRIER')?.priceWithVat,
            currency: "EUR",
            items: items.map(item => ({
                item_id: item.id, // might need to check if this is product id or line item id
                item_name: item.name,
                price: item.priceWithVat || item.price, // Check what order items contain
                quantity: item.quantity
            }))
        });
    }

    // Google Ads Remarketing
    logGoogleAdsRemarketing('purchase', {
        ecomm_prodid: items.map(i => i.id),
        ecomm_totalvalue: order.priceBreakDown?.totalPrice || order.finalPrice,
        ecomm_pagetype: 'purchase'
    });
};

/**
 * generate_lead
 * @param {string} label - Lead source/type
 */
export const logGenerateLead = (label) => {
    if (isGaInitialized()) {
        ReactGA.event("generate_lead", {
            currency: "EUR",
            value: 0, // Leads usually have 0 value unless assigned
            label: label
        });
    }
};

/**
 * out_of_stock_notify (Custom Event)
 * @param {string} productId
 */
export const logOutOfStockNotify = (productId) => {
    if (isGaInitialized()) {
        ReactGA.event("out_of_stock_notify", {
            product_id: productId
        });
    }
};

/**
 * view_blog_post (Custom Event)
 * @param {Object} blog
 */
export const logViewBlogPost = (blog) => {
    if (isGaInitialized()) {
        ReactGA.event("view_blog_post", {
            blog_id: blog.id,
            blog_title: blog.title,
            blog_author: blog.author
        });
    }
};
