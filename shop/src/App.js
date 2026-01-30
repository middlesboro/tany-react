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
import BrandReviews from './pages/BrandReviews';
import MagicLinkPage from './pages/MagicLinkPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import { CartProvider } from './context/CartContext';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { ModalProvider } from './context/ModalContext';
import ScrollToTop from './components/ScrollToTop';
import LoginModal from './components/LoginModal';
import MessageModal from './components/MessageModal';

function App() {
  return (
    <CartProvider>
      <BreadcrumbProvider>
        <ModalProvider>
          <Router>
            <ScrollToTop />
            <LoginModal />
            <MessageModal />
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
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/login" element={<Login isAdmin={false} />} />
                <Route path="/account" element={<Navigate to="/account/personal-data" replace />} />
                <Route path="/account/:tab" element={<Account />} />
                <Route path="/account/orders/:orderId" element={<Account />} />
                <Route path="/packeta" element={<PacketaPage />} />
                <Route path="/biokap-recenzie" element={
                  <BrandReviews
                    brandId="799185bf-064a-4c63-b02b-f0336b99ace4"
                    title="Biokap farby na vlasy - recenzie a skúsenosti"
                    description={`Biokap ponúka 30 ročné skúsenosti vo výskume a vo výrobe rastlinných extraktov. Produkty sú bez obsahu najčastejších alergénov. Produkty v línii Rapid neobsahujú:
 - PEG,
 - Silikóny
 - Parabény
 - SLS
 - Amoniak
 - Rezorcinol
 - PPD (Paraphenylenediamine)
Produkty sú dermatologicky testované a testované tiež na nikel.
Produkty Biokap Rapid sú určené pre ženy s veľmi citlivou a problematickou pokožkou hlavy, alebo s veľmi zničenými a oslabenými vlasmi. Aj preto stačí ponechať farbiacu zmes na vlasoch len 10 minút, čím sa minimalizuje vznik alergickej reakcie.`}
                  />
                } />
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
