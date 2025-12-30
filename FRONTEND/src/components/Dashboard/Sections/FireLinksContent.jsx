import React, { useState } from 'react';
import { MdContentCopy } from 'https://esm.sh/react-icons/md';


const FireLinksContent = ({ showToast, API_BASE_URL }) => {
    const [longUrl, setLongUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!longUrl) {
            showToast('Please enter a long URL.', 'error');
            return;
        }
        if (!expiresAt) {
            showToast('Please select an expiry date and time.', 'error');
            return;
        }

        const expiryDateObj = new Date(expiresAt);
        if (isNaN(expiryDateObj.getTime()) || expiryDateObj <= new Date()) {
            showToast('Invalid or past expiry date/time. Please select a future date.', 'error');
            return;
        }

        setLoading(true);
        setShortenedUrl('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/url/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullUrl: longUrl,
                    customAlias: customAlias.trim() === '' ? null : customAlias,
                    expiresAt: expiryDateObj.toISOString(),
                    type: 'fire', 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const fullShortUrl = `${API_BASE_URL}/${data.shortUrl}`;
                setShortenedUrl(fullShortUrl);
                showToast(data.message || 'Fire Link created successfully! You can now view it in My URLs.', 'success');
                setLongUrl('');
                setCustomAlias('');
                setExpiresAt('');
            } else {
                showToast(data.message || 'Failed to create Fire Link. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error creating Fire Link:', error);
            showToast('An unexpected error occurred while creating Fire Link. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Fire Link (Auto-expiring)</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="fireLongUrl" className="block text-sm font-medium text-gray-700 mb-2">Long URL</label>
                    <input
                        type="url"
                        id="fireLongUrl"
                        placeholder="e.g., https://temporary-offer.com"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fireCustomAlias" className="block text-sm font-medium text-gray-700 mb-2">Custom Alias (Optional)</label>
                    <div className="flex rounded-xl shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            shrinkx.com/
                        </span>
                        <input
                            type="text"
                            id="fireCustomAlias"
                            placeholder="your-expiring-alias"
                            className="flex-1 block w-full p-3 border border-gray-300 rounded-r-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="fireExpiryTime" className="block text-sm font-medium text-gray-700 mb-2">Expiry Date & Time</label>
                    <input
                        type="datetime-local"
                        id="fireExpiryTime"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Fire Link'}
                </button>
                {shortenedUrl && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-green-800 shadow-sm flex items-center justify-between flex-wrap">
                        <p className="font-medium mr-4">Shortened URL:</p>
                        <a href={`${shortenedUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all">
                            {shortenedUrl}
                        </a>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${shortenedUrl}`);
                                showToast('Short URL copied!', 'success');
                            }}
                            className="ml-4 p-2 rounded-full hover:bg-green-100 transition-colors"
                            title="Copy Short URL"
                        >
                            <MdContentCopy className="text-xl" />
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default FireLinksContent;