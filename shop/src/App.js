import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PublicLayout from './components/PublicLayout';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import AuthenticationSuccess from './pages/AuthenticationSuccess';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import GlobalPaymentsCallback from './pages/GlobalPaymentsCallback';
import BesteronCallback from './pages/BesteronCallback';
import CategoryProducts from './pages/CategoryProducts';
import BlogDetail from './pages/BlogDetail';
import Account from './pages/Account';
import PublicPage from './pages/PublicPage';
import { CartProvider } from './context/CartContext';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <CartProvider>
      <BreadcrumbProvider>
        <Router>
          <ScrollToTop />
          <Routes>
          <Route path="/authentication/success" element={<AuthenticationSuccess />} />

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Checkout />} />
            <Route path="/order/confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/global-payments-callback" element={<GlobalPaymentsCallback />} />
            <Route path="/besteron-callback" element={<BesteronCallback />} />
            <Route path="/category/:slug" element={<CategoryProducts />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/login" element={<Login isAdmin={false} />} />
            <Route path="/account" element={<Account />} />
            <Route path="/:slug" element={<PublicPage />} />
          </Route>
        </Routes>
        </Router>
      </BreadcrumbProvider>
    </CartProvider>
  );
}

export default App;
