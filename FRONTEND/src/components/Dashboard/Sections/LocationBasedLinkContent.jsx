import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdDelete, MdContentCopy, MdLink, MdLanguage, MdAddCircle, MdCheckCircle, MdChevronRight } from 'https://esm.sh/react-icons/md';
import CustomUrlInput from '../Common/CustomUrlInput';
const LocationBasedLinkContent = ({ showToast, API_BASE_URL }) => {
    const [longUrl, setLongUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [geoRules, setGeoRules] = useState([{ countryCode: '', redirectUrl: '' }]);
    const [defaultGeoUrl, setDefaultGeoUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddRule = () => {
        setGeoRules([...geoRules, { countryCode: '', redirectUrl: '' }]);
    };

    const handleRemoveRule = (index) => {
        const newRules = geoRules.filter((_, i) => i !== index);
        setGeoRules(newRules);
    };

    const handleRuleChange = (index, field, value) => {
        const newRules = [...geoRules];
        newRules[index][field] = field === 'countryCode' ? value.toUpperCase() : value;
        setGeoRules(newRules);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!longUrl) {
            showToast('Please enter a base URL.', 'error');
            return;
        }
        if (geoRules.some(rule => !rule.countryCode || !rule.redirectUrl)) {
            showToast('Please fill in all country code and redirect URL fields for geo-rules.', 'error');
            return;
        }

        setLoading(true);
        setShortenedUrl('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/url/location-shorten`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    fullUrl: longUrl,
                    customAlias: customAlias.trim() === '' ? null : customAlias,
                    geoRules: geoRules.map(rule => ({ ...rule, countryCode: rule.countryCode.toUpperCase() })), 
                    defaultGeoUrl: defaultGeoUrl.trim() === '' ? null : defaultGeoUrl,
                    type: 'location', 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const fullShortUrl = `${API_BASE_URL}/${data.shortUrl}`;
                setShortenedUrl(fullShortUrl);
                showToast(data.message || 'Location-based URL created successfully!', 'success');
                setLongUrl('');
                setCustomAlias('');
                setGeoRules([{ countryCode: '', redirectUrl: '' }]);
                setDefaultGeoUrl('');
            } else {
                throw new Error(data.message || 'Failed to create location-based URL. Please try again.');
            }
        } catch (error) {
            console.error('Error creating location-based URL:', error);
            showToast(error.message || 'An unexpected error occurred.', 'error');
        } finally {
            setLoading(false);
        }
    };
    const ResultDisplay = () => (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-green-50 rounded-xl border border-green-300 text-green-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between"
        >
            <div className="flex items-start flex-grow min-w-0">
                <MdCheckCircle className="text-2xl text-green-600 mr-4 flex-shrink-0" />
                <div className="min-w-0">
                    <p className="font-semibold mb-1 text-base text-gray-800">Geo-Link created successfully:</p>
                    <a href={`${shortenedUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:underline break-all font-medium text-sm">
                        {shortenedUrl}
                    </a>
                </div>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0 flex-shrink-0">
                <button
                    onClick={() => { navigator.clipboard.writeText(`${shortenedUrl}`); showToast('Short URL copied!', 'success'); }}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-white transition-colors text-sm font-medium shadow-sm"
                    title="Copy Short URL"
                >
                    <MdContentCopy className="text-lg mr-2" />
                    Copy
                </button>
            </div>
        </motion.div>
    );


    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Create Location Based Link</h2>
            <p className="text-gray-500 mb-8">Redirect users to different landing pages based on their geographical location.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="border p-5 rounded-xl bg-gray-50/50 border-gray-200">
                    <label htmlFor="geoLongUrl" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <MdLink className="mr-2 text-indigo-500" /> Default (Fallback) Destination URL *
                    </label>
                    <input
                        type="url"
                        id="geoLongUrl"
                        placeholder="e.g., https://your-main-site.com/global"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-inner outline-none transition disabled:bg-gray-100"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <p className="mt-2 text-xs text-gray-500">This URL is used if the user's location does not match any specified rule below.</p>
                </div>

                <div>
                    <label htmlFor="geoCustomAlias" className="block text-sm font-semibold text-gray-700 mb-2">Custom Alias (Optional)</label>
                    <div className="flex rounded-xl shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 transition duration-150">
                        <span className="inline-flex items-center px-4 rounded-l-xl bg-gray-50 text-gray-500 text-sm border-r border-gray-300">
                            shrinkx.com/
                        </span>
                        <input
                            type="text"
                            id="geoCustomAlias"
                            placeholder="your-country-campaign"
                            className="flex-1 block w-full p-3 rounded-r-xl focus:outline-none disabled:bg-gray-100"
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="space-y-6 p-6 border rounded-xl border-indigo-200 bg-indigo-50/30">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <MdLanguage className="mr-2 text-indigo-600" /> Redirection Rules
                    </h3>
                    <p className="text-sm text-gray-600">Define specific redirect links based on the user's two-letter country code (e.g., US, FR, IN).</p>

                    {geoRules.map((rule, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-end p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            
                            <div className="flex-1 w-full sm:w-auto">
                                <label htmlFor={`countryCode-${index}`} className="block text-xs font-semibold text-gray-600 mb-1">Country Code (2-Letter)</label>
                                <input
                                    type="text"
                                    id={`countryCode-${index}`}
                                    placeholder="e.g., DE"
                                    maxLength={2}
                                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-inner outline-none disabled:bg-gray-100 uppercase"
                                    value={rule.countryCode}
                                    onChange={(e) => handleRuleChange(index, 'countryCode', e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            
                            <div className="flex-2 w-full sm:w-auto min-w-[200px]">
                                <label htmlFor={`redirectUrl-${index}`} className="block text-xs font-semibold text-gray-600 mb-1">Geo-Specific Redirect URL</label>
                                <input
                                    type="url"
                                    id={`redirectUrl-${index}`}
                                    placeholder="https://de-landing-page.com"
                                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-inner outline-none disabled:bg-gray-100"
                                    value={rule.redirectUrl}
                                    onChange={(e) => handleRuleChange(index, 'redirectUrl', e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            
                            {geoRules.length > 1 && (
                                <motion.button
                                    type="button"
                                    onClick={() => handleRemoveRule(index)}
                                    className="p-2.5 rounded-full text-red-500 hover:bg-red-100 transition-colors flex-shrink-0 mt-3 sm:mt-0"
                                    title="Remove Rule"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={loading}
                                >
                                    <MdDelete className="text-2xl" />
                                </motion.button>
                            )}
                        </div>
                    ))}
                    
                    <button
                        type="button"
                        onClick={handleAddRule}
                        className="flex items-center px-4 py-2 border border-indigo-300 rounded-xl shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none transition-colors disabled:opacity-50 mt-4"
                        disabled={loading}
                    >
                        <MdAddCircle className="mr-2 text-xl" />
                        Add New Rule
                    </button>
                </div>

                <div className="flex items-center justify-end pt-4 space-y-3 sm:space-y-0 sm:space-x-4 border-t border-gray-100">
                    <button
                        type="submit"
                        className="flex items-center justify-center px-8 py-3 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition focus:ring-4 focus:ring-indigo-200 w-full sm:w-auto disabled:bg-indigo-400 disabled:cursor-wait"
                        disabled={loading}
                    >
                        {loading ? 'Creating Geo-Link...' : (
                            <>
                                Create Geo-Targeted Link
                                <MdChevronRight className="ml-1 text-xl" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {shortenedUrl && <ResultDisplay />}
        </div>
    );
};

export default LocationBasedLinkContent;