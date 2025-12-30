import React, { useState } from 'react';
import { MdContentCopy, MdLink } from 'https://esm.sh/react-icons/md';
import { motion } from "framer-motion";
import CustomUrlInput from '../Common/CustomUrlInput';


const CustomAliasContent = ({ showToast, API_BASE_URL }) => {
    const [longUrl, setLongUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!longUrl || !customAlias.trim()) {
            showToast('Long URL and Custom Alias are required.', 'error');
            return;
        }

        setLoading(true);
        setShortenedUrl('');

        try {
            
            const response = await fetch(`${API_BASE_URL}/api/url/shorten`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    fullUrl: longUrl,
                    customAlias: customAlias, 
                    type: 'custom', 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const fullShortUrl = `${API_BASE_URL}/${data.shortUrl}`;
                setShortenedUrl(fullShortUrl);
                showToast(data.message || 'Custom URL created successfully!', 'success');
                setLongUrl('');
                setCustomAlias('');
            } else {
                throw new Error(data.message || 'Alias already taken or invalid.');
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
            showToast(error.message || 'An unexpected error occurred.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Custom Alias Builder</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MdLink className="mr-2 text-indigo-500" /> Destination URL
                    </label>
                    <input
                        type="url"
                        id="longUrl"
                        placeholder="https://your-campaign-page.com/id=123"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm outline-none transition"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                
                <CustomUrlInput 
                    customAlias={customAlias}
                    setCustomAlias={setCustomAlias}
                    disabled={loading}
                />

                <div className="pt-4">
                    <button
                        type="submit"
                        className="flex items-center justify-center px-8 py-3 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition disabled:bg-indigo-400 disabled:cursor-wait"
                        disabled={loading}
                    >
                        {loading ? 'Processing Alias...' : 'Create Custom URL'}
                    </button>
                </div>

                {shortenedUrl && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-green-50 rounded-xl border border-green-300 text-green-800 shadow-inner flex items-center justify-between flex-wrap"
                    >
                        <p className="font-medium mr-4">Success! Your new link:</p>
                        <a href={`${shortenedUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all font-mono">
                            {shortenedUrl}
                        </a>
                        <button
                            onClick={() => { navigator.clipboard.writeText(`${shortenedUrl}`); showToast('Short URL copied!', 'success'); }}
                            className="ml-4 p-2 rounded-full hover:bg-green-200 transition-colors"
                            title="Copy Short URL"
                        >
                            <MdContentCopy className="text-xl text-green-700" />
                        </button>
                    </motion.div>
                )}
            </form>
        </div>
    );
};

export default CustomAliasContent;