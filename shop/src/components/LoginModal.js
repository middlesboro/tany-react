import React, { useState } from 'react';
import { useModal } from '../context/ModalContext';
import { requestMagicLink } from '../services/authService';

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, loginMessage } = useModal();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      await requestMagicLink(email);
      setMessage('Skontrolujte si email a kliknite na prihlasovací odkaz.');
    } catch (err) {
      setError('Nepodarilo sa odoslať prihlasovací odkaz. Skúste to prosím neskôr.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Prihlásenie</h2>
          <p className="text-gray-600 mb-6">Zadajte váš email pre prihlásenie bez hesla.</p>

          {loginMessage && !message && (
             <div className="bg-blue-50 text-blue-800 p-4 rounded mb-6 text-sm flex items-start">
               <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span>{loginMessage}</span>
             </div>
          )}

          {message ? (
            <div className="bg-green-50 text-green-700 p-4 rounded mb-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <p className="font-medium">{message}</p>
              <button onClick={closeLoginModal} className="mt-4 text-sm text-green-700 underline">Zavrieť</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tany-green"
                  placeholder="napriklad@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-tany-green text-white font-bold py-3 px-4 rounded hover:bg-green-700 transition disabled:opacity-70"
              >
                {isLoading ? 'Odosielam...' : 'Odoslať prihlasovací odkaz'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
