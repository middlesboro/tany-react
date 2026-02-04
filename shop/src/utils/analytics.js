import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

export const initGA = () => {
    // Check if ID is present to avoid errors in dev/test if missing
    if (GA_MEASUREMENT_ID) {
        ReactGA.initialize(GA_MEASUREMENT_ID);
    }
};

export const logPageView = () => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
};

// Generic event logging
export const logEvent = (category, action, label) => {
    ReactGA.event({ category, action, label });
};

// Ecommerce Events

/**
 * view_item_list
 * @param {Array} items - Array of product objects
 * @param {string} listName - Name of the list (e.g., category name)
 */
export const logViewItemList = (items, listName) => {
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
};

/**
 * view_item
 * @param {Object} item - Product object
 */
export const logViewItem = (item) => {
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
};

/**
 * select_item
 * @param {Object} item - Product object
 */
export const logSelectItem = (item) => {
    ReactGA.event("select_item", {
        item_list_id: "general_list", // You might want to pass this if you know where it came from
        item_list_name: "General List",
        items: [{
            item_id: item.id,
            item_name: item.title,
            price: item.discountPrice || item.price
        }]
    });
};

/**
 * search
 * @param {string} searchTerm
 */
export const logSearch = (searchTerm) => {
    ReactGA.event("search", {
        search_term: searchTerm
    });
};

/**
 * add_to_cart
 * @param {Object} item - Product object
 * @param {number} quantity
 */
export const logAddToCart = (item, quantity = 1) => {
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
};

/**
 * view_cart
 * @param {Object} cart - Cart object
 */
export const logViewCart = (cart) => {
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
};

/**
 * remove_from_cart
 * @param {Object} item - Cart item object
 */
export const logRemoveFromCart = (item) => {
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
};

/**
 * add_to_wishlist
 * @param {Object} item - Product object
 */
export const logAddToWishlist = (item) => {
    ReactGA.event("add_to_wishlist", {
        currency: "EUR",
        value: item.discountPrice || item.price,
        items: [{
            item_id: item.id,
            item_name: item.title,
            price: item.discountPrice || item.price
        }]
    });
};

/**
 * begin_checkout
 * @param {Object} cart - Cart object
 */
export const logBeginCheckout = (cart) => {
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
};

/**
 * add_shipping_info
 * @param {Object} carrier - Carrier object
 * @param {Object} cart - Cart object (for context)
 */
export const logAddShippingInfo = (carrier, cart) => {
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
};

/**
 * add_payment_info
 * @param {Object} payment - Payment object
 * @param {Object} cart - Cart object (for context)
 */
export const logAddPaymentInfo = (payment, cart) => {
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
};

/**
 * purchase
 * @param {Object} order - Order object
 */
export const logPurchase = (order) => {
    // items mapping might differ based on order structure
    const items = order.items || [];

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
};

/**
 * generate_lead
 * @param {string} label - Lead source/type
 */
export const logGenerateLead = (label) => {
    ReactGA.event("generate_lead", {
        currency: "EUR",
        value: 0, // Leads usually have 0 value unless assigned
        label: label
    });
};

/**
 * out_of_stock_notify (Custom Event)
 * @param {string} productId
 */
export const logOutOfStockNotify = (productId) => {
    ReactGA.event("out_of_stock_notify", {
        product_id: productId
    });
};

/**
 * view_blog_post (Custom Event)
 * @param {Object} blog
 */
export const logViewBlogPost = (blog) => {
    ReactGA.event("view_blog_post", {
        blog_id: blog.id,
        blog_title: blog.title,
        blog_author: blog.author
    });
};
