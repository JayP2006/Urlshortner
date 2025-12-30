import React, { useState, useEffect } from 'react';
import Toast from './Common/Toast'; 
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import QrCodeModal from './Modals/QrCodeModal';
import ProtectedLinkPasswordModal from './Modals/ProtectedLinkPasswordModal';
import DashboardOverviewContent from './Sections/DashboardOverviewContent';
import MyUrlsContent from './Sections/MyUrlsContent';
import CreateShortLinkContent from './Sections/CreateShortLinkContent';
import CustomAliasContent from './Sections/CustomAliasContent';
import ProtectedLinksContent from './Sections/ProtectedLinksContent';
import FireLinksContent from './Sections/FireLinksContent';
import LocationBasedLinkContent from './Sections/LocationBasedLinkContent';
import QrCodeGeneratorContent from './Sections/QrCodeGeneratorContent';
import AnalyticsSectionContent from './Sections/AnalyticsSectionContent';
import SettingsContent from './Sections/SettingsContent';
const DashboardUI = () => {
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [user, setUser] = useState(null);

    const [isProtectedLinkModalOpen, setIsProtectedLinkModalOpen] = useState(false);
    const [protectedShortCode, setProtectedShortCode] = useState(null);

    const API_BASE_URL = 'http://localhost:3000';
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Assuming the structure is {user: {...}} or directly {...}
                setUser(parsedUser.user || parsedUser); 
            } catch (err) {
                console.error("Error parsing user from localStorage:", err);
            }
        }
    }, []);
    const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

    const showToast = (message, type) => {
        setToast({ message, type });
    };
    const closeToast = () => {
        setToast(null);
    };

    const openQrModal = async (urlOrData) => {
        if (!urlOrData) {
            showToast('No URL provided for QR code generation.', 'error');
            return;
        }

        setIsQrModalOpen(true);
        setQrCodeDataUrl(''); 
        
        if (urlOrData.startsWith('data:image')) {
            setQrCodeDataUrl(urlOrData);
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/url/generate-qr-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ url: urlOrData }),
            });

            const data = await response.json();

            if (response.ok) {
                setQrCodeDataUrl(data.qrCodeDataUrl);
            } else {
                showToast(data.message || 'Failed to generate QR code.', 'error');
                closeQrModal();
            }
        } catch (error) {
            console.error('Error fetching QR code:', error);
            showToast('An unexpected error occurred while generating QR code.', 'error');
            closeQrModal();
        }
    };

    const closeQrModal = () => {
        setIsQrModalOpen(false);
        setQrCodeDataUrl('');
    };

    const openProtectedLinkModal = (shortCode) => {
        setProtectedShortCode(shortCode);
        setIsProtectedLinkModalOpen(true);
    };
    const closeProtectedLinkModal = () => {
        setProtectedShortCode(null);
        setIsProtectedLinkModalOpen(false);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                showToast('Logged out successfully!', 'success');
                localStorage.removeItem('user'); 
                setUser(null); 
                setTimeout(() => {
                    window.location.href = '/login'; 
                }, 1500);
            } else {
                throw new Error(data.message || 'Logout failed.');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    };
    const getPageTitle = (page) => {
        switch (page) {
            case 'Dashboard': return 'Dashboard Overview';
            case 'MyURLs': return 'My Shortened URLs';
            case 'CreateShortLink': return 'Create Short Link (Default)';
            case 'CustomAlias': return 'Custom Aliases';
            case 'ProtectedLinks': return 'Protected Links';
            case 'FireLinks': return 'Fire Links (Expiring)';
            case 'LocationBasedLink': return 'Location Based Links';
            case 'QrCodeGenerator': return 'QR Code Generator';
            case 'Analytics': return 'Advanced Analytics';
            case 'Settings': return 'Account Settings';
            default: return 'Dashboard';
        }
    };
    return (
        <div className="flex h-screen bg-gray-100 font-sans">

            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isMobileSidebarOpen={isMobileSidebarOpen}
                toggleMobileSidebar={toggleMobileSidebar}
                handleLogout={handleLogout}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavbar
                    currentPageTitle={getPageTitle(currentPage)}
                    toggleMobileSidebar={toggleMobileSidebar}
                    user={user}
                    handleLogout={handleLogout}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
                    {currentPage === 'Dashboard' && <DashboardOverviewContent user={user} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'MyURLs' && <MyUrlsContent openQrModal={openQrModal} showToast={showToast} API_BASE_URL={API_BASE_URL} openProtectedLinkModal={openProtectedLinkModal} setCurrentPage={setCurrentPage} />}
                    {currentPage === 'CreateShortLink' && <CreateShortLinkContent openQrModal={openQrModal} showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'CustomAlias' && <CustomAliasContent showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'ProtectedLinks' && <ProtectedLinksContent openQrModal={openQrModal} showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'FireLinks' && <FireLinksContent showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'LocationBasedLink' && <LocationBasedLinkContent showToast={showToast} API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'QrCodeGenerator' && <QrCodeGeneratorContent openQrModal={openQrModal} showToast={showToast} />}
                    {currentPage === 'Analytics' && <AnalyticsSectionContent API_BASE_URL={API_BASE_URL} />}
                    {currentPage === 'Settings' && <SettingsContent 
                user={user} 
                setUser={setUser} 
                showToast={showToast} 
                API_BASE_URL={API_BASE_URL} 
                handleLogout={handleLogout}
            />}
                </main>
            </div>
            {isQrModalOpen && <QrCodeModal qrCodeDataUrl={qrCodeDataUrl} onClose={closeQrModal} />}
            {isProtectedLinkModalOpen && protectedShortCode && (
                <ProtectedLinkPasswordModal
                    shortCode={protectedShortCode}
                    onClose={closeProtectedLinkModal}
                    showToast={showToast}
                    API_BASE_URL={API_BASE_URL}
                />
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
        </div>
    );
};

export default DashboardUI;