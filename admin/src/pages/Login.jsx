import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { requestMagicLink } from '../services/authService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

const Login = ({ isAdmin = false }) => {
  const { setBreadcrumbs } = useBreadcrumbs();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (!isAdmin) {
      setBreadcrumbs([
        { label: 'Domov', path: '/' },
        { label: 'Prihlásenie', path: null }
      ]);
    }
  }, [setBreadcrumbs, isAdmin]);

  useEffect(() => {
    if (location.state?.message) {
        setError(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestMagicLink(email);
      setMessage('Skontrolujte si email a kliknite na prihlasovací odkaz.');
      setError('');

      let redirectPath = location.state?.from?.pathname;
      if (redirectPath && isAdmin && !redirectPath.startsWith('/admin')) {
        redirectPath = '/admin' + redirectPath;
      }
      if (!redirectPath) {
        redirectPath = isAdmin ? '/admin/carts' : '/';
      }
      localStorage.setItem('post_login_redirect', redirectPath);
    } catch (err) {
      setError('Nepodarilo sa odoslať prihlasovací odkaz. Skúste to prosím neskôr.');
      setMessage('');
    }
  };

  const containerClass = isAdmin
    ? "flex items-center justify-center min-h-screen bg-gray-100"
    : "flex items-center justify-center my-10";

  return (
    <div className={containerClass}>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isAdmin ? "Admin Login" : "Prihlásenie"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Send Login Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
