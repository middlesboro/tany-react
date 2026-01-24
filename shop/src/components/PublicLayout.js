import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import { getBlogs } from '../services/blogService';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import { getUserEmail } from '../services/authService';
import ProductSearch from './ProductSearch';
import CategoryTree from './CategoryTree';
import BlogSlider from './BlogSlider';
import Breadcrumbs from './Breadcrumbs';

const PublicLayout = () => {
  const { cart, customer } = useCart();
  const { openLoginModal } = useModal();
  const location = useLocation();
  const userEmail = customer?.email || getUserEmail();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        // Filter visible blogs
        const visibleBlogs = data.filter(blog => blog.visible);
        setBlogs(visibleBlogs);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };
    fetchBlogs();
  }, []);

  // Prepare the display list with "All Products" prepended (for mobile menu - still flat for now or maybe we should use the tree there too?
  // User only asked for left side tree view. Mobile menu implementation is tricky with tree, keeping it flat for top level for now or I can try to flatten it if needed.
  // But wait, the previous implementation was only showing top level categories anyway because it was just mapping `categories`.
  // If `categories` is now a tree, `categories.map` only iterates top level. So the mobile menu will show top level categories, which is acceptable.)
  const displayCategories = [
    ...categories.map(cat => ({
      name: cat.title,
      path: `/category/${cat.slug}`,
    }))
  ];

  // Determine if sidebar should be shown (everywhere except /cart and /order and /order/confirmation/*)
  const showSidebar = !['/cart', '/order'].includes(location.pathname) && !location.pathname.startsWith('/order/confirmation');

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-700">
      {/* Top Bar */}
      <div className="bg-tany-grey border-b border-gray-200 text-xs text-gray-500 hidden md:block">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex space-x-4">
            <span className="flex items-center">
              <span className="text-tany-red mr-1 font-bold">+421 944 432 457</span>
            </span>
            <span className="flex items-center">
              <a href="mailto:info@tany.sk" className="hover:text-tany-green transition-colors">info@tany.sk</a>
            </span>
          </div>
          <div className="flex space-x-4">
             {userEmail ? (
                <Link to="/account" className="hover:text-tany-green transition-colors">{userEmail}</Link>
             ) : (
                <button onClick={() => openLoginModal()} className="hover:text-tany-green transition-colors">Prihlásenie</button>
             )}
             <Link to="/admin" className="hover:text-tany-green transition-colors">Admin</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="https://tany.b-cdn.net/img/leo-tea-logo-1586598211.jpg"
              alt="Tany.sk"
              className="h-16 object-contain"
            />
          </Link>

          {/* Search Bar */}
          <ProductSearch />

          {/* Cart */}
          <div className="flex-shrink-0">
            <Link to="/cart" className="flex items-center group">
              <div className="relative p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 group-hover:text-tany-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-2 hidden lg:block">
                <span className="block text-xs text-gray-500">Nákupný košík</span>
                <span className="block text-sm font-bold group-hover:text-tany-green">
                  {cart ? (
                    cart.priceBreakDown?.totalPrice !== undefined ? `${cart.priceBreakDown.totalPrice.toFixed(2)} €` :
                    (cart.finalPrice !== undefined ? `${cart.finalPrice.toFixed(2)} €` :
                    (cart.totalProductPrice ? `${cart.totalProductPrice.toFixed(2)} €` : '0,00 €'))
                  ) : '0,00 €'}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-tany-dark-grey text-white border-t-4 border-tany-green sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between md:justify-start">

           {/* Mobile Menu Button (Hamburger) */}
           <button
             className="md:hidden p-3 focus:outline-none hover:bg-gray-700"
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
             <span className="ml-2 font-bold uppercase text-sm">Menu</span>
           </button>

           {/* Desktop Horizontal Menu - Optional, user asked for vertical, but keeping top menu is standard practice */}
           <ul className="hidden md:flex flex-wrap text-sm font-bold uppercase">
             <li className="group relative">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `block py-4 px-3 transition-colors ${isActive ? 'bg-tany-green hover:bg-green-700 text-white' : 'hover:text-tany-green'}`}
                >
                  Domov
                </NavLink>
             </li>
             <li>
                <NavLink
                  to="/doprava"
                  className={({ isActive }) => `block py-4 px-3 transition-colors ${isActive ? 'bg-tany-green hover:bg-green-700 text-white' : 'hover:text-tany-green'}`}
                >
                  Doprava
                </NavLink>
             </li>
             <li>
                <NavLink
                  to="/moznosti-platby"
                  className={({ isActive }) => `block py-4 px-3 transition-colors ${isActive ? 'bg-tany-green hover:bg-green-700 text-white' : 'hover:text-tany-green'}`}
                >
                  Možnosti platby
                </NavLink>
             </li>
             <li>
                <NavLink
                  to="/akcie"
                  className={({ isActive }) => `block py-4 px-3 transition-colors ${isActive ? 'bg-tany-green hover:bg-green-700 text-white' : 'hover:text-tany-green text-tany-red'}`}
                >
                  Akcie
                </NavLink>
             </li>
             <li>
                <NavLink
                  to="/obchodne-podmienky"
                  className={({ isActive }) => `block py-4 px-3 transition-colors ${isActive ? 'bg-tany-green hover:bg-green-700 text-white' : 'hover:text-tany-green'}`}
                >
                  Obchodné podmienky
                </NavLink>
             </li>
           </ul>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white text-gray-800 border-t border-gray-200">
             <ul className="flex flex-col">
               {displayCategories.map((cat, index) => (
                 <li key={index} className="border-b border-gray-100">
                   <Link
                     to={cat.path}
                     className={`block py-3 px-4 hover:bg-gray-50 hover:text-tany-green ${cat.color || ''} ${cat.highlight ? 'bg-gray-50 font-bold' : ''}`}
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     {cat.name}
                   </Link>
                 </li>
               ))}
             </ul>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow bg-white pb-12">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        <div className="container mx-auto px-4 pt-6">
           <div className="flex flex-col md:flex-row gap-8">

              {/* Left Sidebar - Categories */}
              {showSidebar && (
                <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
                   <div id="sidebar-filter-root" className="mb-6"></div>
                   <CategoryTree categories={categories} />

                   {/* Banner placeholder often found in left column */}
                   <div className="mt-6 bg-gray-100 h-64 flex items-center justify-center text-gray-400 text-sm border border-gray-200">
                      Reklama / Banner
                   </div>
                </aside>
              )}

              {/* Main Content Content */}
              <main className={`flex-1 ${showSidebar ? 'w-full md:w-3/4 lg:w-4/5' : 'w-full'}`}>
                 <Outlet />
              </main>

           </div>
        </div>

        {/* Blog Section */}
        {blogs.length > 0 && (
           <div className="border-t border-gray-200 mt-12">
             <BlogSlider blogs={blogs} />
           </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-tany-grey pt-12 pb-6 border-t border-gray-200 text-sm text-gray-600 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

            {/* Column 1: Informácie */}
            <div>
              <h4 className="font-bold text-gray-800 text-lg mb-4 uppercase">Informácie</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-tany-green transition-colors">Obchodné podmienky</a></li>
                <li><a href="#" className="hover:text-tany-green transition-colors">Doprava</a></li>
                <li><a href="#" className="hover:text-tany-green transition-colors">Možnosti platby</a></li>
                <li><a href="#" className="hover:text-tany-green transition-colors">Newsletter – ochrana údajov</a></li>
                <li><a href="#" className="hover:text-tany-green transition-colors">Reklamácie</a></li>
              </ul>
            </div>

             {/* Column 2: Váš účet */}
             <div>
              <h4 className="font-bold text-gray-800 text-lg mb-4 uppercase">Váš účet</h4>
              <ul className="space-y-2">
                <li><Link to="/account" className="hover:text-tany-green transition-colors">Osobné údaje</Link></li>
                <li><Link to="/account" className="hover:text-tany-green transition-colors">Objednávky</Link></li>
                <li><Link to="/account" className="hover:text-tany-green transition-colors">Adresy</Link></li>
                <li><a href="#" className="hover:text-tany-green transition-colors">Sledovanie objednávky</a></li>
              </ul>
            </div>

            {/* Column 3: Kontaktné informácie */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-gray-800 text-lg mb-4 uppercase">Kontaktné informácie</h4>
              <div className="space-y-3">
                 <p className="font-bold text-tany-red text-lg">+421 944 432 457</p>
                 <p>
                   <strong>Bc. Tatiana Grňová - Tany.sk</strong><br/>
                   IČO: 50 350 595<br/>
                   IČ DPH: SK1077433060
                 </p>
                 <p>
                   Budatínska 24, 85106, Bratislava - Petržalka<br/>
                   <a href="mailto:info@tany.sk" className="text-tany-green font-bold">info@tany.sk</a>
                 </p>
                 <div className="mt-4 pt-4 border-t border-gray-200">
                    <p><strong>Vrátenie tovaru:</strong></p>
                    <p>Spoločnosť: isklad 190270/09<br/>Dialničná cesta 5, Hala D, Gate 35, 90301 Senec</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
             <p>&copy; {new Date().getFullYear()} Tany.sk. Všetky práva vyhradené.</p>
             <p>Vytvorené na mieru.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
