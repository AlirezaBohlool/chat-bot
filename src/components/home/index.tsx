'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { useWalletLogin } from '@/wallet/hooks/wallet-auth';

export default function Home() {
  const router = useRouter();
  // Replace this with your real auth state (e.g., from Redux or Context)
  const token = useSelector((state: any) => state.auth.token);
  const { isConnected } = useWalletLogin();
  // Mock authentication logic for now
  const isAuthenticated = Boolean(token); // Change this when connecting to API

  // Sidebar responsive state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/auth/login');
  //   }
  // }, [isAuthenticated, router]);

  // if (!isAuthenticated) {
  //   return null; // Prevent flash of content while redirecting
  // }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-gray-900 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Sidebar: responsive */}
      <div className={`fixed inset-y-0 left-0 z-40 md:static md:translate-x-0 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block`}>
        <Sidebar />
      </div>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Welcome to Chat Bot</h1>
          {/* Add your chat interface here */}
        </div>
      </main>
    </div>
  );
}
