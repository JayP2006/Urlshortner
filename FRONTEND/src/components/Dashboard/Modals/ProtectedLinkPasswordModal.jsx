import React, { useState } from 'react';
import { MdClose } from 'https://esm.sh/react-icons/md';
const ProtectedLinkPasswordModal = ({ shortCode, onClose, showToast, API_BASE_URL }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        if (!password) {
            showToast('Please enter the password.', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/url/check-protected-link/${shortCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ password }),
                redirect: 'manual', 
            });

            if (response.status >= 300 && response.status < 400) {
                const redirectedUrl = response.headers.get('Location');
                if (redirectedUrl) {
                    onClose();
                    showToast('Password correct! Redirecting...', 'success');
                    window.open(redirectedUrl, '_blank');
                } else {
                    showToast('Error: Redirect URL not found in response.', 'error');
                }
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    if (response.ok && data.success && data.fullUrl) {
                        onClose();
                        showToast('Password correct! Redirecting...', 'success');
                        window.open(data.fullUrl, '_blank');
                    } else {
                        showToast(data.message || 'Incorrect password. Please try again.', 'error');
                    }
                } else {
                    console.error('Backend responded with non-JSON error.');
                    showToast('An unexpected server response occurred.', 'error');
                }
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            showToast('An error occurred while verifying password.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-sm relative">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Enter Password</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
                        <MdClose className="text-2xl" />
                    </button>
                </div>
                <form onSubmit={handleSubmitPassword} className="p-6 space-y-4">
                    <p className="text-gray-700">This link is protected. Please enter the password to proceed:</p>
                    <div>
                        <label htmlFor="modalPassword" className="sr-only">Password</label>
                        <input
                            type="password"
                            id="modalPassword"
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Unlock Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProtectedLinkPasswordModal;