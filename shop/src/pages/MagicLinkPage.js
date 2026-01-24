import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generatePKCE } from '../services/authService';

const MagicLinkPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const initiateAuth = async () => {
      if (!token) {
        console.error("No token found in magic link");
        return;
      }

      try {
        const { verifier, challenge } = await generatePKCE();

        // Store verifier for the callback step
        localStorage.setItem('pkce_verifier', verifier);

        const authUrl = new URL(`${process.env.REACT_APP_BACKEND_BASE_URL}/oauth2/authorize`);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('client_id', 'public-client');
        authUrl.searchParams.append('redirect_uri', `${window.location.origin}/oauth/callback`);
        authUrl.searchParams.append('scope', 'openid profile offline_access');
        authUrl.searchParams.append('code_challenge', challenge);
        authUrl.searchParams.append('code_challenge_method', 'S256');

        // Attach the magic link token
        authUrl.searchParams.append('token', token);

        // Redirect
        window.location.href = authUrl.toString();
      } catch (error) {
        console.error("Failed to initiate auth", error);
      }
    };

    initiateAuth();
  }, [token]);

  if (!token) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-red-500">Invalid Login Link.</p>
        </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tany-green"></div>
      <p className="text-gray-600">Logging you in...</p>
    </div>
  );
};

export default MagicLinkPage;
