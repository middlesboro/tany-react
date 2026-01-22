import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AuthenticationSuccess from './pages/AuthenticationSuccess';
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
import Blogs from './pages/Blogs';
import BlogEdit from './pages/BlogEdit';
import Pages from './pages/Pages';
import PageEdit from './pages/PageEdit';
import Suppliers from './pages/Suppliers';
import SupplierEdit from './pages/SupplierEdit';
import FilterParameters from './pages/FilterParameters';
import FilterParameterEdit from './pages/FilterParameterEdit';
import FilterParameterValues from './pages/FilterParameterValues';
import FilterParameterValueEdit from './pages/FilterParameterValueEdit';
import Carriers from './pages/Carriers';
import CarrierEdit from './pages/CarrierEdit';
import Payments from './pages/Payments';
import PaymentEdit from './pages/PaymentEdit';
import ShopSettings from './pages/ShopSettings';
import ProductLabels from './pages/ProductLabels';
import ProductLabelEdit from './pages/ProductLabelEdit';
import CartDiscounts from './pages/CartDiscounts';
import CartDiscountEdit from './pages/CartDiscountEdit';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
      <BreadcrumbProvider>
        <Router basename="/admin">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/shop-settings" replace />} />
            <Route path="/login" element={<Login isAdmin={true} />} />
            <Route path="/authentication/success" element={<AuthenticationSuccess />} />

            <Route element={<AdminLayout />}>
              <Route path="shop-settings" element={<ShopSettings />} />
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
              <Route path="pages" element={<Pages />} />
              <Route path="pages/new" element={<PageEdit />} />
              <Route path="pages/:id" element={<PageEdit />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/new" element={<BlogEdit />} />
              <Route path="blogs/:id" element={<BlogEdit />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="suppliers/new" element={<SupplierEdit />} />
              <Route path="suppliers/:id" element={<SupplierEdit />} />
              <Route path="product-labels" element={<ProductLabels />} />
              <Route path="product-labels/new" element={<ProductLabelEdit />} />
              <Route path="product-labels/:id" element={<ProductLabelEdit />} />
              <Route path="cart-discounts" element={<CartDiscounts />} />
              <Route path="cart-discounts/new" element={<CartDiscountEdit />} />
              <Route path="cart-discounts/:id" element={<CartDiscountEdit />} />
              <Route path="filter-parameters" element={<FilterParameters />} />
              <Route path="filter-parameters/new" element={<FilterParameterEdit />} />
              <Route path="filter-parameters/:id" element={<FilterParameterEdit />} />
              <Route path="filter-parameter-values" element={<FilterParameterValues />} />
              <Route path="filter-parameter-values/new" element={<FilterParameterValueEdit />} />
              <Route path="filter-parameter-values/:id" element={<FilterParameterValueEdit />} />
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
      </BreadcrumbProvider>
  );
}

export default App;
