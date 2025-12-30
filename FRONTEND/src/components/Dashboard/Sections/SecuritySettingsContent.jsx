import React, { useState } from 'react';
import { FaKey } from 'https://esm.sh/react-icons/fa';

const SecuritySettingsContent = ({ showToast, API_BASE_URL }) => {
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
    const [loadingPassword, setLoadingPassword] = useState(false);

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword.length < 6) { 
             showToast('New password must be at least 6 characters long.', 'error');
             return;
        }
        setLoadingPassword(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(passwordData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            showToast('Password changed successfully!', 'success');
            setPasswordData({ oldPassword: '', newPassword: '' });
        } catch (error) {
            showToast(error.message || 'Failed to change password. Check current password.', 'error');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center"><FaKey className="mr-3 text-purple-600" /> Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input 
                        type="password" 
                        name="oldPassword" 
                        value={passwordData.oldPassword} 
                        onChange={handlePasswordChange} 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition" 
                        disabled={loadingPassword}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Min 6 characters)</label>
                    <input 
                        type="password" 
                        name="newPassword" 
                        value={passwordData.newPassword} 
                        onChange={handlePasswordChange} 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition" 
                        disabled={loadingPassword}
                        required
                        minLength={6}
                    />
                </div>
                <button 
                    type="submit" 
                    className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition disabled:bg-purple-400 disabled:cursor-wait"
                    disabled={loadingPassword || !passwordData.oldPassword || !passwordData.newPassword}
                >
                    {loadingPassword ? 'Updating...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default SecuritySettingsContent;