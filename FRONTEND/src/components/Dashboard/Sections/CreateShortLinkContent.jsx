import React, { useState } from 'react';
import { MdQrCode2, MdContentCopy } from 'https://esm.sh/react-icons/md';
const CreateShortLinkContent = ({ openQrModal, showToast, API_BASE_URL }) => {
    const [longUrl, setLongUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [generatedQrCodeDataUrl, setGeneratedQrCodeDataUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!longUrl) {
            showToast('Please enter a long URL.', 'error');
            return;
        }
        setLoading(true);
        setShortenedUrl('');
        setGeneratedQrCodeDataUrl('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/url/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullUrl: longUrl,
                    type: 'standard', 
                }),
            });
            const data = await response.json();
            if (response.ok) {
                const fullShortUrl = `${API_BASE_URL}/${data.shortUrl}`; 
                setShortenedUrl(fullShortUrl);
                setGeneratedQrCodeDataUrl(data.qrCodeDataUrl);
                showToast(data.message || 'Default URL shortened successfully!', 'success');
                setLongUrl('');
            } else {
                showToast(data.message || 'Failed to shorten URL. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Default Short URL</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-2">Long URL</label>
                    <input
                        type="url"
                        id="longUrl"
                        placeholder="e.g., https://very-long-and-complicated-url.com/some/path/to/resource"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center pt-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            if (generatedQrCodeDataUrl) {
                                openQrModal(generatedQrCodeDataUrl);
                            } else if (shortenedUrl) {
                                openQrModal(shortenedUrl);
                            } else {
                                showToast('Please shorten a URL first to preview its QR Code.', 'info');
                            }
                        }}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                        disabled={loading}
                    >
                        <MdQrCode2 className="mr-2 text-lg" />
                        Preview QR Code
                    </button>
                    <button
                        type="submit"
                        className="ml-auto flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                        disabled={loading}
                    >
                        {loading ? 'Shortening...' : 'Shorten URL'}
                    </button>
                </div>
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

export default CreateShortLinkContent;