import React, { useState } from 'react';
import { MdQrCode2, MdContentCopy } from 'https://esm.sh/react-icons/md';

const ApiSettingsContent = ({ showToast, API_BASE_URL }) => {
    const [apiKey, setApiKey] = useState('Click below to generate your key.'); 
    const [loadingApiKey, setLoadingApiKey] = useState(false);

    const handleGenerateApiKey = async () => {
        setLoadingApiKey(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/api-key`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setApiKey(data.apiKey);
            showToast('API Key generated! Keep it secure.', 'success');
        } catch (error) {
            showToast(error.message || 'Failed to generate API Key.', 'error');
        } finally {
            setLoadingApiKey(false);
        }
    };

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(apiKey).then(() => {
            showToast('API Key copied to clipboard!', 'info');
        }).catch(() => {
            showToast('Failed to copy API Key.', 'error');
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center"><MdQrCode2 className="mr-3 text-teal-600" /> API Key Management</h3>
            <p className="text-gray-600 mb-4">Use this key for programmatic link shortening via our API. Treat it like a password.</p>
            
            <div className="flex items-center space-x-3 mb-4">
                <div className="flex-grow p-3 bg-gray-100 rounded-xl font-mono text-sm text-gray-800 break-all border border-gray-300 select-all cursor-text">
                    {apiKey}
                </div>
                <button 
                    onClick={handleCopyApiKey} 
                    className="p-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition duration-150"
                    title="Copy API Key"
                    disabled={apiKey === 'Click below to generate your key.'}
                >
                    <MdContentCopy className="text-xl" />
                </button>
            </div>

            <div className="flex items-center space-x-4">
                <button 
                    onClick={handleGenerateApiKey} 
                    className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition disabled:bg-teal-400 disabled:cursor-wait"
                    disabled={loadingApiKey}
                >
                    {loadingApiKey ? 'Generating Key...' : 'Generate New Key'}
                </button>
                <p className="text-xs text-red-500">Warning: Generating a new key will instantly invalidate the old one.</p>
            </div>
        </div>
    );
};

export default ApiSettingsContent;