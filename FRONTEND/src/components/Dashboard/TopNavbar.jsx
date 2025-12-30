import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { MdLogout, MdMenu, MdSettings, MdKey, MdAccountCircle } from 'https://esm.sh/react-icons/md';
import { FaUserCircle } from 'https://esm.sh/react-icons/fa';
const ProfileDropdown = ({ user, handleLogout, setCurrentPage }) => {
    const menuOptions = [
        { name: 'Account Settings', icon: MdSettings, page: 'Settings' },
        { name: 'My Profile', icon: MdAccountCircle, page: 'Profile' },
    ];

    const handleNavigationClick = (pageKey) => {
        setCurrentPage(pageKey === 'Profile' ? 'Settings' : pageKey); 
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        >
            <div className="p-4 bg-indigo-50 rounded-t-xl">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email || 'N/A'}</p>
            </div>
            
            <div className="py-1">
                {menuOptions.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleNavigationClick(item.page)}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <item.icon className="mr-3 h-5 w-5 text-indigo-500" />
                        {item.name}
                    </button>
                ))}
            </div>

            <div className="py-1">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                    <MdLogout className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </motion.div>
    );
};
const TopNavbar = ({ currentPageTitle, toggleMobileSidebar, user, handleLogout, setCurrentPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);
    const handleMenuNavigation = (pageKey) => {
        setCurrentPage(pageKey);
        setIsMenuOpen(false);
    }

    return (
        <div className="flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-lg p-4 lg:p-5 border-b border-gray-100">
            <div className="flex items-center">
                <button
                    onClick={toggleMobileSidebar}
                    className="lg:hidden mr-4 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <MdMenu className="text-2xl" />
                </button>
                <div className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                    {currentPageTitle}
                </div>
            </div>
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none ring-2 ring-transparent focus:ring-indigo-300"
                >
                    {user?.gravatar ? (
                        <img
                            src={user.gravatar}
                            alt={user.name}
                            className={`w-9 h-9 rounded-full object-cover transition-all duration-300 ${isMenuOpen ? 'ring-2 ring-indigo-500' : ''}`}
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/36x36/6366F1/ffffff?text=U" }} // Fallback
                        />
                    ) : (
                        <FaUserCircle className={`text-3xl text-gray-600 transition-colors ${isMenuOpen ? 'text-indigo-600' : ''}`} />
                    )}
                    <span className="text-gray-700 hidden md:block font-medium text-sm">{user?.name}</span>
                </button>
                <AnimatePresence>
                    {isMenuOpen && (
                        <ProfileDropdown 
                            user={user} 
                            handleLogout={handleLogout} 
                            setCurrentPage={handleMenuNavigation} 
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TopNavbar;