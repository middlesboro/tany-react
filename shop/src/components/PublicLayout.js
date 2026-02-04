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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userEmail = customer?.email || getUserEmail();
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
      {/* Main Header */}
      <header className="bg-white py-4 md:py-6 relative z-50">
        <div className="container mx-auto px-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 order-1">
            <img
              src="/tany_logo.png"
              alt="Tany.sk"
              className="h-12 md:h-14 object-contain"
            />
          </Link>

          {/* Search Bar - Centered and Wide */}
          <div className="w-full md:w-auto md:flex-1 order-3 md:order-2 max-w-2xl mx-auto mt-2 md:mt-0">
             <ProductSearch />
          </div>

          {/* Actions - Right */}
          <div className="flex items-center gap-4 md:gap-6 flex-shrink-0 order-2 md:order-3 ml-auto md:ml-0">
            {/* User Account */}
            {userEmail ? (
                <Link to="/account" className="group flex flex-col items-center justify-center text-gray-600 hover:text-tany-green transition-colors">
                    <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <span className="hidden lg:block text-xs font-medium max-w-[80px] truncate">Môj účet</span>
                </Link>
            ) : (
                <button onClick={() => openLoginModal()} className="group flex flex-col items-center justify-center text-gray-600 hover:text-tany-green transition-colors">
                     <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                     </div>
                     <span className="hidden lg:block text-xs font-medium">Prihlásiť</span>
                </button>
            )}

            {/* Cart */}
            <Link to="/cart" className="group flex items-center gap-2">
              <div className="relative p-2 rounded-full group-hover:bg-green-50 text-gray-600 group-hover:text-tany-green transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 hidden lg:block">Košík</span>
                <span className="text-sm font-bold text-gray-800 group-hover:text-tany-green transition-colors">
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
      <nav className="bg-tany-dark-grey text-white sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">

           {/* Mobile Menu Button (Hamburger) */}
           <button
             className="md:hidden p-3 -ml-3 focus:outline-none hover:text-tany-green transition-colors"
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
           >
             <div className="flex items-center gap-2">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
                 <span className="font-bold uppercase text-sm">Menu</span>
             </div>
           </button>

           {/* Desktop Horizontal Menu */}
           <ul className="hidden md:flex flex-wrap text-sm font-bold uppercase tracking-wider">
             <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `block py-4 px-5 border-b-2 transition-all duration-200 ${isActive ? 'border-tany-green text-tany-green' : 'border-transparent hover:text-tany-green hover:border-tany-green'}`}
                >
                  Domov
                </NavLink>
             </li>
             <li>
                <NavLink
                  to="/doprava"
                  className={({ isActive }) => `block py-4 px-5 border-b-2 transition-all duration-200 ${isActive ? 'border-tany-green text-tany-green' : 'border-transparent hover:text-tany-green hover:border-tany-green'}`}
                >
                  Doprava
                </NavLink>
             </li>
             <li>
                <NavLink
                  to="/moznosti-platby"
                  className={({ isActive }) => `block py-4 px-5 border-b-2 transition-all duration-200 ${isActive ? 'border-tany-green text-tany-green' : 'border-transparent hover:text-tany-green hover:border-tany-green'}`}
                >
                  Možnosti platby
                </NavLink>
             </li>
             <li>
                <NavLink
                  to="/akcie"
                  className={({ isActive }) => `block py-4 px-5 border-b-2 transition-all duration-200 ${isActive ? 'border-tany-green text-tany-green' : 'border-transparent hover:text-tany-green hover:border-tany-green text-tany-red'}`}
                >
                  Akcie
                </NavLink>
             </li>
             <li>
                <NavLink
                  to="/obchodne-podmienky"
                  className={({ isActive }) => `block py-4 px-5 border-b-2 transition-all duration-200 ${isActive ? 'border-tany-green text-tany-green' : 'border-transparent hover:text-tany-green hover:border-tany-green'}`}
                >
                  Obchodné podmienky
                </NavLink>
             </li>
             <li>
                <NavLink
                  to="/ponukane-znacky"
                  className={({ isActive }) => `block py-4 px-5 border-b-2 transition-all duration-200 ${isActive ? 'border-tany-green text-tany-green' : 'border-transparent hover:text-tany-green hover:border-tany-green'}`}
                >
                  Ponúkané značky
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
