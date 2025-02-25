import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <img className="h-8 w-auto" src="/logo.svg" alt="IPA System" />
                <span className="ml-2 text-xl font-bold text-blue-600">IPA System</span>
              </div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } cursor-pointer`}>
                Home
              </span>
            </Link>
            <Link href="/dashboard">
              <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } cursor-pointer`}>
                Dashboard
              </span>
            </Link>
            <Link href="/documents">
              <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/documents') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } cursor-pointer`}>
                Documents
              </span>
            </Link>
            <Link href="/workflows">
              <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/workflows') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } cursor-pointer`}>
                Workflows
              </span>
            </Link>
            <Link href="/chatbot">
              <span className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/chatbot') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } cursor-pointer`}>
                Chatbot
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/">
              <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } cursor-pointer`}>
                Home
              </span>
            </Link>
            <Link href="/dashboard">
              <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } cursor-pointer`}>
                Dashboard
              </span>
            </Link>
            <Link href="/documents">
              <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/documents') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } cursor-pointer`}>
                Documents
              </span>
            </Link>
            <Link href="/workflows">
              <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/workflows') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } cursor-pointer`}>
                Workflows
              </span>
            </Link>
            <Link href="/chatbot">
              <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/chatbot') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } cursor-pointer`}>
                Chatbot
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;