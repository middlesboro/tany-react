import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Customers from './pages/Customers';
import Carts from './pages/Carts';

function App() {
  return (
    <Router>
      <div className="flex">
        <nav className="w-64 h-screen bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold mb-4">Admin</h1>
          <ul>
            <li className="mb-2">
              <Link to="/products" className="hover:text-gray-300">Products</Link>
            </li>
            <li className="mb-2">
              <Link to="/categories" className="hover:text-gray-300">Categories</Link>
            </li>
            <li className="mb-2">
              <Link to="/customers" className="hover:text-gray-300">Customers</Link>
            </li>
            <li className="mb-2">
              <Link to="/carts" className="hover:text-gray-300">Carts</Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/carts" element={<Carts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
