import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
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
             <Link to="/login" className="hover:text-tany-green transition-colors">Prihlásenie</Link>
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

          {/* Search Bar (Placeholder) */}
          <div className="flex-grow max-w-xl w-full mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Hľadať v obchode..."
                className="w-full border border-gray-300 rounded-sm py-2 px-4 focus:outline-none focus:border-tany-green"
              />
              <button className="absolute right-0 top-0 h-full bg-tany-green text-white px-4 hover:bg-green-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart */}
          <div className="flex-shrink-0">
            <Link to="/cart" className="flex items-center group">
              <div className="relative p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 group-hover:text-tany-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                 {/* Badge placeholder - logic can be added later */}
                 {/* <span className="absolute top-0 right-0 bg-tany-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">0</span> */}
              </div>
              <div className="ml-2 hidden lg:block">
                <span className="block text-xs text-gray-500">Nákupný košík</span>
                <span className="block text-sm font-bold group-hover:text-tany-green">0,00 €</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-tany-dark-grey text-white border-t-4 border-tany-green sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap text-sm font-bold uppercase tracking-wide">
             <li className="group relative">
                <Link to="/" className="block py-4 px-5 bg-tany-green hover:bg-green-700 transition-colors">
                  Všetky produkty
                </Link>
             </li>
             <li><a href="#" className="block py-4 px-5 hover:text-tany-green transition-colors text-tany-red">VÝPREDAJ</a></li>
             <li><a href="#" className="block py-4 px-5 hover:text-tany-green transition-colors">Ajurvédska kozmetika</a></li>
             <li><a href="#" className="block py-4 px-5 hover:text-tany-green transition-colors">Leto s Tany</a></li>
             <li><a href="#" className="block py-4 px-5 hover:text-tany-green transition-colors">Henna na vlasy</a></li>
             <li><a href="#" className="block py-4 px-5 hover:text-tany-green transition-colors">Profesionálna kozmetika</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-white pb-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-tany-grey pt-12 pb-6 border-t border-gray-200 text-sm text-gray-600">
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
                <li><Link to="/login" className="hover:text-tany-green transition-colors">Osobné údaje</Link></li>
                <li><Link to="/login" className="hover:text-tany-green transition-colors">Objednávky</Link></li>
                <li><Link to="/login" className="hover:text-tany-green transition-colors">Adresy</Link></li>
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
