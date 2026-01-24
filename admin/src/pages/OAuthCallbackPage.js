import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { exchangeToken, setToken } from '../services/authService';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const verifier = localStorage.getItem('pkce_verifier');

      if (!code) {
        setError('Authorization code not found.');
        return;
      }

      if (!verifier) {
        setError('PKCE verifier not found. Please try logging in again.');
        return;
      }

      try {
        const accessToken = await exchangeToken(code, verifier);
        setToken(accessToken);
        localStorage.removeItem('pkce_verifier');

        // Check for saved redirect path
        const redirectPath = localStorage.getItem('post_login_redirect') || '/';
        localStorage.removeItem('post_login_redirect');

        navigate(redirectPath);
      } catch (err) {
        console.error('Token exchange failed', err);
        setError('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <button
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:underline"
        >
            Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600">Finalizing login...</p>
    </div>
  );
};

export default OAuthCallbackPage;
