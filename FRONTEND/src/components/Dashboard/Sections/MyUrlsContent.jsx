import React, { useState, useEffect } from 'react';
import { 
    MdContentCopy, 
    MdDelete, 
    MdQrCode2, 
    MdAnalytics, 
    MdLock, 
    MdLocalFireDepartment, 
    MdLanguage,
    MdSearch, 
    MdFilterList, 
    MdChevronLeft,
    MdChevronRight
} from 'https://esm.sh/react-icons/md';

const URLS_PER_PAGE = 5;
const StatusBadge = ({ type }) => {
    let colorClasses = '';
    let icon = null;
    let label = '';

    switch (type) {
        case 'protected':
            colorClasses = 'bg-yellow-100 text-yellow-800 border-yellow-300';
            icon = <MdLock className="w-3 h-3" />;
            label = 'Protected';
            break;
        case 'fire':
            colorClasses = 'bg-red-100 text-red-800 border-red-300';
            icon = <MdLocalFireDepartment className="w-3 h-3" />;
            label = 'Fire Link';
            break;
        case 'location':
            colorClasses = 'bg-blue-100 text-blue-800 border-blue-300';
            icon = <MdLanguage className="w-3 h-3" />;
            label = 'Geo-Targeted';
            break;
        case 'custom':
            colorClasses = 'bg-indigo-100 text-indigo-800 border-indigo-300';
            icon = <MdLanguage className="w-3 h-3" />;
            label = 'Custom Alias';
            break;
        case 'standard':
        default:
            colorClasses = 'bg-gray-100 text-gray-600 border-gray-300';
            icon = <MdLanguage className="w-3 h-3" />;
            label = 'Standard';
            break;
    }

    return (
        <span 
            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} shadow-sm transition duration-150 ease-in-out`}
            title={label}
        >
            {icon}
        </span>
    );
};

const LoadingRow = ({ count }) => (
    [...Array(count)].map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-gray-100">
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-100 rounded w-full mt-1"></div>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </td>
            <td className="px-6 py-4">
                <div className="flex justify-end space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
            </td>
        </tr>
    ))
);

const MyUrlsContent = ({ openQrModal, showToast, API_BASE_URL, openProtectedLinkModal, setCurrentPage }) => {
    const [userUrls, setUserUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [currentPageInternal, setCurrentPageInternal] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAllLinks, setShowAllLinks] = useState(false);

    // Debounced fetch function
    useEffect(() => {
        const fetchUserUrls = async () => {
            try {
                setLoading(true);
                setError(null);

                const queryParams = new URLSearchParams({
                    page: currentPageInternal,
                    search: searchTerm,
                    type: filterType === 'All Types' ? '' : filterType,
                    limit: URLS_PER_PAGE,
                    excludeExpired: showAllLinks ? 'false' : 'true', 
                });

                const response = await fetch(`${API_BASE_URL}/api/url/my-urls?${queryParams.toString()}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch URLs.');
                }

                const data = await response.json();
                setUserUrls(data.urls.map(url => ({ 
                    ...url, 
                    type: url.password ? 'protected' : url.expiresAt ? 'fire' : url.geo_rules && url.geo_rules.length > 0 ? 'location' : url.customAlias ? 'custom' : 'standard' 
                })));
                setTotalPages(data.totalPages);
                setCurrentPageInternal(data.currentPage);

            } catch (err) {
                setError(err.message);
                showToast(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        if (currentPageInternal !== 1 && (searchTerm !== '' || filterType !== 'All Types')) {
            setCurrentPageInternal(1);
        }

        const debounceFetch = setTimeout(fetchUserUrls, 400);
        return () => clearTimeout(debounceFetch);
    }, [API_BASE_URL, showToast, currentPageInternal, searchTerm, filterType, showAllLinks]);

    const handleCopy = (text) => {
        if (document.execCommand) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Short link copied!', 'success');
            return;
        }
        navigator.clipboard.writeText(text)
            .then(() => showToast('Short link copied!', 'success'))
            .catch(() => showToast('Failed to copy. Please copy manually.', 'error'));
    };

    const handleDelete = async (id) => {
        console.log(`Attempting to delete URL ID: ${id}. Confirmation needed.`);

        try {
            const response = await fetch(`${API_BASE_URL}/api/url/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                showToast(data.message || 'URL deleted successfully.', 'success');
                setCurrentPageInternal(p => p); 
            } else {
                showToast(data.message || 'Failed to delete URL.', 'error');
            }
        } catch (error) {
            showToast('Something went wrong while deleting the URL.', 'error');
        }
    };

    const handleViewAnalytics = (id) => {
        setCurrentPage('Analytics');
        console.log(`Navigating to Analytics for URL ID: ${id}`);
    };

    const renderActionIcon = (Icon, onClick, title, color = 'text-gray-500', hover = 'hover:text-indigo-600') => (
        <button 
            onClick={onClick}
            className={`p-2 rounded-full transition duration-150 ease-in-out ${color} ${hover} hover:bg-indigo-50/50`}
            title={title}
            aria-label={title}
        >
            <Icon className="w-5 h-5" />
        </button>
    );

    const renderUrlRow = (url) => {
        const fullShortUrl = `${API_BASE_URL}/${url.short_url}`;
        
        return (
            <tr key={url._id} className="bg-white hover:bg-gray-50 transition duration-150 ease-in-out border-b border-gray-100">
                <td className="px-6 py-4 space-y-2 align-top">
                    <a 
                        href={fullShortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-indigo-600 font-semibold text-base hover:text-indigo-700 hover:underline transition truncate block"
                        title={fullShortUrl}
                    >
                        {fullShortUrl.replace(/^https?:\/\//, '').split('/')[0]}/{url.short_url}
                    </a>
                    <div className="mt-1">
                        <StatusBadge type={url.type} />
                    </div>
                </td>
                <td className="px-6 py-4 max-w-sm text-sm align-top">
                    {/* Original URL */}
                    <p className="truncate text-gray-500 text-xs" title={url.full_url}>
                        <span className="font-semibold text-gray-700">Original:</span> {url.full_url}
                    </p>
                    {url.aiTitle && (
                        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-gray-900 font-bold text-sm truncate" title={url.aiTitle}>
                                {url.aiTitle}
                            </p>
                            {url.aiDescription && (
                                <p className="text-gray-600 text-xs mt-1 line-clamp-2" title={url.aiDescription}>
                                    {url.aiDescription}
                                </p>
                            )}
                        </div>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 align-top text-center">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-50 text-indigo-700 font-extrabold shadow">
                        {url.clicks}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                    {new Date(url.createdAt).toLocaleDateString()}
                    <div className="text-xs text-gray-400">
                        {new Date(url.createdAt).toLocaleTimeString()}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                    <div className="flex items-center justify-end space-x-1">
                        {renderActionIcon(MdContentCopy, () => handleCopy(fullShortUrl), 'Copy Link', 'text-gray-500', 'hover:text-indigo-600')}
                        {renderActionIcon(MdQrCode2, () => openQrModal(fullShortUrl), 'Generate QR Code', 'text-blue-600', 'hover:text-blue-800')}
                        {renderActionIcon(MdAnalytics, () => handleViewAnalytics(url._id), 'View Analytics', 'text-green-600', 'hover:text-green-800')}
                        {renderActionIcon(MdDelete, () => handleDelete(url._id), 'Delete URL', 'text-red-600', 'hover:text-red-800')}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100/50">
              
                <div className="flex flex-col md:flex-row justify-between items-stretch mb-6 gap-4">
                    <div className="relative flex-grow">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by long URL or short alias..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm outline-none transition duration-150 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <select
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm outline-none appearance-none bg-white transition duration-150 text-sm"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="All Types">All Types</option>
                                <option value="standard">Standard (Default)</option>
                                <option value="protected">Password Protected</option>
                                <option value="fire">Temporary / Fire Link</option>
                                <option value="location">Geo-Targeted</option>
                                <option value="custom">Custom Alias</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 text-sm">
                            <input
                                type="checkbox"
                                id="showAllLinksToggle"
                                checked={showAllLinks}
                                onChange={(e) => setShowAllLinks(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded shadow-sm cursor-pointer"
                            />
                            <label htmlFor="showAllLinksToggle" className="text-gray-700 font-medium whitespace-nowrap select-none">
                                With Expired Links
                            </label>
                        </div>
                    </div>
                </div>
                <div className="shadow-md rounded-xl overflow-x-auto">
                    {/* Applying max-h and overflow-y-auto to this container makes the table body scrollable */}
                    <div className="max-h-[60vh] overflow-y-auto border border-gray-200 rounded-xl">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-indigo-50/70 border-b border-indigo-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Short Link & Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Original URL & Content Preview</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-indigo-700 uppercase tracking-wider">Clicks</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-indigo-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100">
                                {loading ? (
                                    <LoadingRow count={URLS_PER_PAGE} />
                                ) : error ? (
                                    <tr><td colSpan="5" className="text-center py-12 text-red-600 font-medium">{error}</td></tr>
                                ) : userUrls.length > 0 ? (
                                    userUrls.map(renderUrlRow)
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No URLs found matching your criteria. Try adjusting the search or filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-6 p-4 border-t border-gray-100">
                    <button
                        onClick={() => setCurrentPageInternal(p => p - 1)}
                        disabled={currentPageInternal <= 1 || loading}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                    >
                        <MdChevronLeft className="w-5 h-5 mr-1" />
                        Previous
                    </button>

                    <span className="text-sm text-gray-600 font-medium">
                        Page <span className="text-indigo-600 font-bold">{currentPageInternal}</span> of <span className="text-indigo-600 font-bold">{totalPages}</span>
                    </span>

                    <button
                        onClick={() => setCurrentPageInternal(p => p + 1)}
                        disabled={currentPageInternal >= totalPages || loading}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                    >
                        Next
                        <MdChevronRight className="w-5 h-5 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyUrlsContent;