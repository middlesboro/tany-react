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
import Orders from './pages/Orders';
import OrderEdit from './pages/OrderEdit';
import Login from './pages/Login';
import AuthenticationSuccess from './pages/AuthenticationSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/authentication/success" element={<AuthenticationSuccess />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductEdit />} />
          <Route path="products/:id" element={<ProductEdit />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/new" element={<CategoryEdit />} />
          <Route path="categories/:id" element={<CategoryEdit />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/new" element={<CustomerEdit />} />
          <Route path="customers/:id" element={<CustomerEdit />} />
          <Route path="carts" element={<Carts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<OrderEdit />} />
          <Route path="orders/:id" element={<OrderEdit />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
