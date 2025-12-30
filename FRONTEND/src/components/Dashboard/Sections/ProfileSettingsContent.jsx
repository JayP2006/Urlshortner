import React, { useState } from 'react';
import { FaUserEdit } from 'https://esm.sh/react-icons/fa';

const ProfileSettingsContent = ({ user, setUser, showToast, API_BASE_URL }) => {
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
    const [loadingProfile, setLoadingProfile] = useState(false);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(profileData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            showToast('Profile updated successfully!', 'success');
            setUser(data.user); 
        } catch (error) {
            showToast(error.message || 'Failed to update profile.', 'error');
        } finally {
            setLoadingProfile(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center"><FaUserEdit className="mr-3 text-blue-600" /> Account Details</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={profileData.name} 
                        onChange={handleProfileChange} 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition" 
                        disabled={loadingProfile}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={profileData.email} 
                        className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl cursor-not-allowed text-gray-500" 
                        disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">Email is read-only for security reasons.</p>
                </div>
                <button 
                    type="submit" 
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-wait"
                    disabled={loadingProfile}
                >
                    {loadingProfile ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default ProfileSettingsContent;