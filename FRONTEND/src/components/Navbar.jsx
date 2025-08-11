// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, MenuIcon, XIcon, SparklesIcon } from '@heroicons/react/outline';

const Navbar = ({ darkMode, setDarkMode, menuOpen, setMenuOpen }) => {
  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-12 py-4 shadow-lg sticky top-0 z-50 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md transition-colors duration-500">
      <Link to="/" className="flex items-center space-x-2">
        <SparklesIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">ShrinkX</h1>
      </Link>

      <div className="flex items-center space-x-4 md:hidden">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <SunIcon className="w-6 h-6 text-yellow-500" /> : <MoonIcon className="w-6 h-6" />}
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <Link
          to="/login"
          className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 dark:border-blue-400 dark:text-blue-400"
        >
          Register
        </Link>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <SunIcon className="w-6 h-6 text-yellow-500" /> : <MoonIcon className="w-6 h-6" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
