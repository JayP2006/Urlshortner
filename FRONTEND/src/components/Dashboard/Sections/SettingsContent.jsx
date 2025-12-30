import React, { useState } from 'react';
import { MdAccountCircle, MdKey, MdQrCode2, MdDeleteForever, MdChevronRight } from 'https://esm.sh/react-icons/md';
import ProfileSettingsContent from './ProfileSettingsContent';
import SecuritySettingsContent from './SecuritySettingsContent';
import ApiSettingsContent from './ApiSettingsContent';
import DangerZoneContent from './DangerZoneContent';
const SettingsPage = ({ user, setUser, showToast, API_BASE_URL, handleLogout }) => {
    const [activeTab, setActiveTab] = useState('Profile');
    const tabs = [
        { key: 'Profile', icon: MdAccountCircle, title: 'Profile & Account Details', description: 'Update name and view account details.' },
        { key: 'Security', icon: MdKey, title: 'Security & Password', description: 'Change your login password.' },
        { key: 'API', icon: MdQrCode2, title: 'API & Integrations', description: 'Manage your access key for external tools.' },
        { key: 'DangerZone', icon: MdDeleteForever, title: 'Account Deletion', description: 'Permanently delete your account and data.', color: 'text-red-500 hover:bg-red-50' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Profile':
                return <ProfileSettingsContent user={user} setUser={setUser} showToast={showToast} API_BASE_URL={API_BASE_URL} />;
            case 'Security':
                return <SecuritySettingsContent showToast={showToast} API_BASE_URL={API_BASE_URL} />;
            case 'API':
                return <ApiSettingsContent showToast={showToast} API_BASE_URL={API_BASE_URL} />;
            case 'DangerZone':
                return <DangerZoneContent showToast={showToast} API_BASE_URL={API_BASE_URL} handleLogout={handleLogout} />;
            default:
                return <ProfileSettingsContent user={user} setUser={setUser} showToast={showToast} API_BASE_URL={API_BASE_URL} />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <nav className="w-full lg:w-64 flex-shrink-0 bg-white p-4 rounded-xl shadow-lg border border-gray-100 h-fit">
                <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Settings Menu</h3>
                <div className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors duration-150 group
                                ${tab.key === activeTab
                                    ? `bg-blue-600 text-white font-semibold shadow-md ${tab.color ? tab.color.replace('hover:bg-red-50', '') : ''}`
                                    : `text-gray-700 hover:bg-gray-100 ${tab.color || ''}`
                                }`}
                        >
                            <span className="flex items-center">
                                <tab.icon className={`mr-3 text-xl ${tab.key === 'DangerZone' && tab.key !== activeTab ? 'text-red-500' : ''}`} />
                                <span className="text-sm">{tab.title.split(' ')[0]}</span> 
                            </span>
                            <MdChevronRight className="text-xl group-hover:translate-x-1 transition-transform" />
                        </button>
                    ))}
                </div>
            </nav>
            <div className="flex-1 min-w-0">
                <div className="mb-6 pb-2 border-b border-gray-300">
                    <h1 className="text-3xl font-extrabold text-gray-800">{tabs.find(t => t.key === activeTab)?.title}</h1>
                    <p className="text-gray-500">{tabs.find(t => t.key === activeTab)?.description}</p>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};
export default SettingsPage;