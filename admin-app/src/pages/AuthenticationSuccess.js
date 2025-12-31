import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken, exchangeToken } from '../services/authService';

const AuthenticationSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const authorizationCode = searchParams.get('authorizationCode');

    const authenticate = async () => {
      try {
        if (authorizationCode) {
          const token = await exchangeToken(authorizationCode);
          setToken(token);
          navigate('/admin', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error(err);
        setError('Authentication failed. Please try logging in again.');
      }
    };

    authenticate();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthenticationSuccess;
