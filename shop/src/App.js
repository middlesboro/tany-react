import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import PacketaPage from './pages/PacketaPage';
import MagicLinkPage from './pages/MagicLinkPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import { CartProvider } from './context/CartContext';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { ModalProvider } from './context/ModalContext';
import ScrollToTop from './components/ScrollToTop';
import LoginModal from './components/LoginModal';

function App() {
  return (
    <CartProvider>
      <BreadcrumbProvider>
        <ModalProvider>
          <Router>
            <ScrollToTop />
            <LoginModal />
            <Routes>
              <Route path="/authentication/success" element={<AuthenticationSuccess />} />
              <Route path="/magic-link" element={<MagicLinkPage />} />
              <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

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
                <Route path="/account" element={<Navigate to="/account/personal-data" replace />} />
                <Route path="/account/:tab" element={<Account />} />
                <Route path="/account/orders/:orderId" element={<Account />} />
                <Route path="/packeta" element={<PacketaPage />} />
                <Route path="/:slug" element={<PublicPage />} />
              </Route>
            </Routes>
          </Router>
        </ModalProvider>
      </BreadcrumbProvider>
    </CartProvider>
  );
}

export default App;
