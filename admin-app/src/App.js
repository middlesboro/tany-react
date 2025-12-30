import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './pages/Products';
import ProductEdit from './pages/ProductEdit';
import Categories from './pages/Categories';
import CategoryEdit from './pages/CategoryEdit';
import Customers from './pages/Customers';
import CustomerEdit from './pages/CustomerEdit';
import Carts from './pages/Carts';
import Orders from './pages/Orders';
import OrderEdit from './pages/OrderEdit';

function App() {
  return (
    <Router>
      <div className="flex">
        <nav className="w-64 h-screen bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold mb-4">Admin</h1>
          <ul>
            <li className="mb-2">
              <Link to="/admin/products" className="hover:text-gray-300">Products</Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/categories" className="hover:text-gray-300">Categories</Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/customers" className="hover:text-gray-300">Customers</Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/carts" className="hover:text-gray-300">Carts</Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/orders" className="hover:text-gray-300">Orders</Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/products/new" element={<ProductEdit />} />
            <Route path="/admin/products/:id" element={<ProductEdit />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/categories/new" element={<CategoryEdit />} />
            <Route path="/admin/categories/:id" element={<CategoryEdit />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/customers/new" element={<CustomerEdit />} />
            <Route path="/admin/customers/:id" element={<CustomerEdit />} />
            <Route path="/admin/carts" element={<Carts />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/orders/new" element={<OrderEdit />} />
            <Route path="/admin/orders/:id" element={<OrderEdit />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
