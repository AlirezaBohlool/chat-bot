'use client'
import React, { useState } from 'react';
import { useWalletLogin } from '@/wallet/hooks/wallet-auth';

const Register = () => {
  const [referralCode, setReferralCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const {
    isLoading,
    walletError,
    isConnected,
    address,
    handleConnectWallet,
    handleWalletLogin,
  } = useWalletLogin({
    metaData: referralCode,
    onLoginSuccess: () => setSubmitted(true),
    onLoginError: (err) => setError(err?.message || 'Registration failed'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isConnected) {
      handleConnectWallet();
      return;
    }
    try {
      await handleWalletLogin();
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    }
  };

  if (submitted) return <div>Registration successful!</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Register with Wallet
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Referral Code"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value)}
              required
              className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
            >
              {isConnected ? 'Register' : 'Connect Wallet'}
            </button>
          </div>
          {walletError && <div className="text-red-500 text-center">{walletError}</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Register;
