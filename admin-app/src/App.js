import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PublicLayout from './components/PublicLayout';
import ProductDetail from './pages/ProductDetail';
import AdminLayout from './components/AdminLayout';
import Products from './pages/Products';
import ProductEdit from './pages/ProductEdit';
import Categories from './pages/Categories';
import CategoryEdit from './pages/CategoryEdit';
import Customers from './pages/Customers';
import CustomerEdit from './pages/CustomerEdit';
import Carts from './pages/Carts';
import CartDetail from './pages/CartDetail';
import Orders from './pages/Orders';
import OrderEdit from './pages/OrderEdit';
import Brands from './pages/Brands';
import BrandEdit from './pages/BrandEdit';
import Suppliers from './pages/Suppliers';
import SupplierEdit from './pages/SupplierEdit';
import Carriers from './pages/Carriers';
import CarrierEdit from './pages/CarrierEdit';
import Payments from './pages/Payments';
import PaymentEdit from './pages/PaymentEdit';
import Login from './pages/Login';
import AuthenticationSuccess from './pages/AuthenticationSuccess';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import CategoryProducts from './pages/CategoryProducts';
import ShopSettings from './pages/ShopSettings';
import ShopSettingsEdit from './pages/ShopSettingsEdit';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<Login isAdmin={true} />} />
          <Route path="/authentication/success" element={<AuthenticationSuccess />} />

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Checkout />} />
            <Route path="/order/confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/category/:slug" element={<CategoryProducts />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login isAdmin={false} />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
          <Route path="shop-settings" element={<ShopSettings />} />
          <Route path="shop-settings/new" element={<ShopSettingsEdit />} />
          <Route path="shop-settings/:id" element={<ShopSettingsEdit />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductEdit />} />
          <Route path="products/:id" element={<ProductEdit />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/new" element={<CategoryEdit />} />
          <Route path="categories/:id" element={<CategoryEdit />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/new" element={<CustomerEdit />} />
          <Route path="customers/:id" element={<CustomerEdit />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brands/new" element={<BrandEdit />} />
          <Route path="brands/:id" element={<BrandEdit />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="suppliers/new" element={<SupplierEdit />} />
          <Route path="suppliers/:id" element={<SupplierEdit />} />
          <Route path="carriers" element={<Carriers />} />
          <Route path="carriers/new" element={<CarrierEdit />} />
          <Route path="carriers/:id" element={<CarrierEdit />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/new" element={<PaymentEdit />} />
          <Route path="payments/:id" element={<PaymentEdit />} />
          <Route path="carts" element={<Carts />} />
          <Route path="carts/:id" element={<CartDetail />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<OrderEdit />} />
          <Route path="orders/:id" element={<OrderEdit />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
