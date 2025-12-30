import React from 'react';
import { MdDashboard, MdOutlineLink, MdAddLink, MdCreate, MdLock, MdLocalFireDepartment, MdQrCode2, MdAnalytics, MdSettings, MdLogout, MdClose, MdLanguage, MdMenu } from 'https://esm.sh/react-icons/md';
const Sidebar = ({ currentPage, setCurrentPage, isMobileSidebarOpen, toggleMobileSidebar, handleLogout }) => (
    <>
        {isMobileSidebarOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden" onClick={toggleMobileSidebar}></div>
        )}

        <div className={`fixed inset-y-0 left-0 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full bg-white shadow-md w-64 p-4 border-r border-gray-200 z-50`}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                    <img src="https://placehold.co/32x32/FFC0CB/000000?text=SX" alt="ShrinkX Logo" className="h-8 w-8 rounded-full object-contain" />
                    <span className="text-2xl font-bold text-gray-800">ShrinkX</span>
                </div>
                <button onClick={toggleMobileSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-md">
                    <MdClose className="text-2xl" />
                </button>
            </div>
            <nav className="space-y-2 flex-grow overflow-y-auto">
                <button onClick={() => { setCurrentPage('Dashboard'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'Dashboard' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdDashboard className="mr-3 text-xl" />Dashboard</button>
                <button onClick={() => { setCurrentPage('MyURLs'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'MyURLs' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdOutlineLink className="mr-3 text-xl" />My URLs</button>
                <button onClick={() => { setCurrentPage('CreateShortLink'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'CreateShortLink' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdAddLink className="mr-3 text-xl" />Create Short Link</button>
                <button onClick={() => { setCurrentPage('CustomAlias'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'CustomAlias' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdCreate className="mr-3 text-xl" />Custom Alias</button>
                <button onClick={() => { setCurrentPage('ProtectedLinks'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'ProtectedLinks' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdLock className="mr-3 text-xl" />Protected Links</button>
                <button onClick={() => { setCurrentPage('FireLinks'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'FireLinks' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdLocalFireDepartment className="mr-3 text-xl" />Fire Links</button>
                <button onClick={() => { setCurrentPage('LocationBasedLink'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'LocationBasedLink' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdLanguage className="mr-3 text-xl" />Location Based Link</button>
                <button onClick={() => { setCurrentPage('QrCodeGenerator'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'QrCodeGenerator' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdQrCode2 className="mr-3 text-xl" />QR Code Generator</button>
                <button onClick={() => { setCurrentPage('Analytics'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'Analytics' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdAnalytics className="mr-3 text-xl" />Analytics</button>
                <button onClick={() => { setCurrentPage('Settings'); if (isMobileSidebarOpen) toggleMobileSidebar(); }} className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'Settings' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MdSettings className="mr-3 text-xl" />Settings</button>
            </nav>
            <div className="mt-auto pt-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 text-red-600 hover:bg-red-50"
                >
                    <MdLogout className="mr-3 text-xl" />
                    Logout
                </button>
            </div>
        </div>
    </>
);

export default Sidebar;