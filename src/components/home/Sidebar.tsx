import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useDisconnect } from '@reown/appkit/react';
import { useRouter } from 'next/navigation';
import { FiPackage } from 'react-icons/fi';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_role_id');
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="flex-1 p-4">
        <div className="space-y-3 gap-2 ">
          <Link 
            href="/chat/new" 
            className="flex items-center space-x-3 gap-2 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>New Chat</span>
          </Link>
          <Link 
            href="/packages" 
            className="flex items-center space-x-3 gap-2 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FiPackage />
             <span>Packages</span>
          </Link>
        </div>
        <div className='w-full h-[1px] bg-amber-50 mt-5 '></div>
        <section className='flex flex-col gap-2 mt-5 ml-3'>
          <div className='rounded-lg hover:bg-gray-700 transition-colors py-2 pl-2 cursor-pointer'>chat history</div>
          <div className='rounded-lg hover:bg-gray-700 transition-colors py-2 pl-2 cursor-pointer'>chat history</div>
          <div className='rounded-lg hover:bg-gray-700 transition-colors py-2 pl-2 cursor-pointer'>chat history</div>
          <div className='rounded-lg hover:bg-gray-700 transition-colors py-2 pl-2 cursor-pointer'>chat history</div>
          <div className='rounded-lg hover:bg-gray-700 transition-colors py-2 pl-2 cursor-pointer'>chat history</div>
          <div className='rounded-lg hover:bg-gray-700 transition-colors py-2 pl-2 cursor-pointer'>chat history</div>
          <div className='rounded-lg hover:bg-gray-700 transition-colors py-2 pl-2 cursor-pointer'>chat history</div>
          <div className='rounded-lg hover:bg-gray-700 transition-colors py-2 pl-2 cursor-pointer'>chat history</div>
        </section>
      </div>
    </aside>
  );
}
