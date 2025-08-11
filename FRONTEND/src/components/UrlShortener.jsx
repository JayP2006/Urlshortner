import React, { useState, useEffect, useRef } from 'react';
import { MdDashboard, MdOutlineLink, MdAddLink, MdCreate, MdLock, MdLocalFireDepartment, MdQrCode2, MdAnalytics, MdSettings, MdLogout, MdContentCopy, MdEdit, MdDelete, MdBarChart, MdPieChart, MdLanguage, MdClose, MdCloudDownload, MdMenu } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { motion } from "framer-motion";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const Toast = ({ message, type, onClose }) => {
  const toastClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg text-white ${toastClasses[type]} flex items-center space-x-2 z-50`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <MdClose className="text-xl" />
      </button>
    </div>
  );
};

const DashboardOverviewContent = ({ user }) => {
  const stats = [
    {
      title: "Total Links",
      value: "100",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
    },
    {
      title: "Total Clicks",
      value: "5,000",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
    },
    {
      title: "Active Links",
      value: "85",
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-800",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <div className="text-center mb-8">
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, {user?.name}!
        </motion.h1>
        <p className="mt-2 text-sm md:text-base text-gray-500">
          Glad to see you back on your dashboard 🎉
        </p>
      </div>

      <p className="text-gray-700 text-center mb-6">
        Here's a quick overview of your activity:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`p-4 rounded-xl border shadow-sm ${stat.bg} ${stat.border} ${stat.text}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <h3 className="text-lg font-medium mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


const MyUrlsContent = ({ openQrModal, showToast, API_BASE_URL }) => {
  const [userUrls, setUserUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserUrls = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/api/url/my-urls`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            showToast('Please log in to view your URLs.', 'error');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch URLs.');
          }
        }

        const data = await response.json();
        setUserUrls(data);
      } catch (err) {
        console.error('Error fetching user URLs:', err);
        setError(err.message);
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserUrls();
  }, [API_BASE_URL, showToast]);

  const handleCopy = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(err => {
          console.error('Failed to copy text using clipboard API: ', err);
          showToast('Failed to copy!', 'error');
        });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('Copied to clipboard!', 'success');
      } catch (err) {
        console.error('Failed to copy text (fallback): ', err);
        showToast('Failed to copy!', 'error');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };
const handleDelete = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/url/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();

      if (response.ok) {
        showToast(data.message || 'URL deleted successfully.', 'success');
        setUserUrls((prevUrls) => prevUrls.filter((url) => url._id !== id));
      } else {
        showToast(data.message || 'Failed to delete URL.', 'error');
      }
    } else {
      const text = await response.text(); // just for debugging
      console.error('Expected JSON but got:', text);
      showToast('Unexpected response format from server.', 'error');
    }
  } catch (error) {
    console.error('Delete URL error:', error);
    showToast('Something went wrong while deleting the URL.', 'error');
  }
};



  const handleEdit = (id) => {
    showToast(`Editing URL with ID: ${id}`, 'info');
  };

  const handleViewAnalytics = (id) => {
    showToast(`Viewing analytics for URL ID: ${id}`, 'info');
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-center text-gray-600">
        Loading your URLs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Shortened URLs</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Filter URLs..."
          className="p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none w-full sm:w-auto flex-grow"
        />
        <select className="p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none w-full sm:w-auto">
          <option>All Types</option>
          <option>Custom</option>
          <option>Standard</option>
          <option>Protected</option>
          <option>Fire</option>
          <option>Location Based</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Link</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Link</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {userUrls.length > 0 ? (
            userUrls.map((url) => (
              <tr key={url._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                  <a href={`${API_BASE_URL}/${url.short_url}`} target="_blank" rel="noopener noreferrer">{`${API_BASE_URL}/${url.short_url}`}</a>
                </td>
                <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500" title={url.full_url}>
                  {url.full_url}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{url.clicks}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(url.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleCopy(`${API_BASE_URL}/${url.short_url}`)} className="text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100" title="Copy Short Link">
                      <MdContentCopy className="text-xl" />
                    </button>
                    <button 
                      onClick={() => openQrModal(`${url.full_url}`)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-gray-100" 
                      title="View QR Code"
                    >
                      <MdQrCode2 className="text-xl" />
                    </button>
                    <button onClick={() => handleViewAnalytics(url._id)} className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-gray-100" title="View Analytics">
                      <MdAnalytics className="text-xl" />
                    </button>
                    <button onClick={() => handleDelete(url._id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-gray-100" title="Delete Link">
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No shortened URLs found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Previous</button>
        <span className="text-sm text-gray-700">Page 1 of 5</span>
        <button className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Next</button>
      </div>
    </div>
  );
};

const CreateShortLinkContent = ({ openQrModal, showToast, API_BASE_URL }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [generatedQrCodeDataUrl, setGeneratedQrCodeDataUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!longUrl) {
      showToast('Please enter a long URL.', 'error');
      return;
    }

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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortenedUrl(data.shortUrl);
        setGeneratedQrCodeDataUrl(data.qrCodeDataUrl);
        showToast(data.message || 'Default URL shortened successfully! You can now view it in My URLs.', 'success');
        setLongUrl('');
        setCustomAlias('');
      } else {
        showToast(data.message || 'Failed to shorten URL. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      showToast('An unexpected error occurred. Please try again.', 'error');
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
        <div>
          <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-2">Custom Alias (Optional)</label>
          <div className="flex rounded-xl shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              shrinkx.com/
            </span>
            <input
              type="text"
              id="customAlias"
              placeholder="your-custom-alias"
              className="flex-1 block w-full p-3 border border-gray-300 rounded-r-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
            />
          </div>
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
          >
            <MdQrCode2 className="mr-2 text-lg" />
            Preview QR Code
          </button>
          <button type="submit" className="ml-auto flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto">
            Shorten URL
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

const CustomAliasContent = ({ showToast, API_BASE_URL }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!longUrl) {
      showToast('Please enter a long URL.', 'error');
      return;
    }

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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortenedUrl(data.shortUrl);
        showToast(data.message || 'URL successfully shortened! You can now view it in My URLs.', 'success');
        setLongUrl('');
        setCustomAlias('');
      } else {
        showToast(data.message || 'Failed to shorten URL. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Custom Short URL</h2>
      <p className="text-gray-700 mb-6">Create and manage personalized short links for your URLs.</p>
      
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
        <div>
          <label htmlFor="customAliasInput" className="block text-sm font-medium text-gray-700 mb-2">Custom Alias (Optional)</label>
          <div className="flex rounded-xl shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              shrinkx.com/
            </span>
            <input
              type="text"
              id="customAliasInput"
              placeholder="your-custom-alias"
              className="flex-1 block w-full p-3 border border-gray-300 rounded-r-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Only letters, numbers, hyphens, and underscores are allowed.</p>
        </div>
        
        <div className="flex items-center pt-4">
          <button type="submit" className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto">
            Shorten Custom URL
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

const ProtectedLinksContent = ({ showToast }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Protected URL created successfully!', 'success');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Protected Link</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="protectedLongUrl" className="block text-sm font-medium text-gray-700 mb-2">Long URL</label>
          <input
            type="url"
            id="protectedLongUrl"
            placeholder="e.g., https://secret-document.com"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="protectedCustomAlias" className="block text-sm font-medium text-gray-700 mb-2">Custom Alias (Optional)</label>
          <div className="flex rounded-xl shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              bit.ly/
            </span>
            <input
              type="text"
              id="protectedCustomAlias"
              placeholder="your-secret-alias"
              className="flex-1 block w-full p-3 border border-gray-300 rounded-r-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="protectedPassword" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="protectedPassword"
            placeholder="Enter password for this link"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
            required
          />
        </div>
        <button type="submit" className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create Protected URL
        </button>
      </form>
    </div>
  );
};

const FireLinksContent = ({ showToast, API_BASE_URL }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState(''); 
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [generatedQrCodeDataUrl, setGeneratedQrCodeDataUrl] = useState('');

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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortenedUrl(data.shortUrl);
        setGeneratedQrCodeDataUrl(data.qrCodeDataUrl);
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
        <button type="submit" className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create Fire Link
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

const LocationBasedLinkContent = () => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Location Based Links</h2>
    <p className="text-gray-700">Redirect users to different URLs based on their geographical location.</p>
    <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200 text-purple-800 shadow-sm">
      <p>Enhance user experience by providing localized content.</p>
    </div>
  </div>
);

const QrCodeGeneratorContent = ({ openQrModal, showToast, API_BASE_URL }) => {
  const [qrUrlInput, setQrUrlInput] = useState('');

  const handleGenerateQr = async () => {
    if (!qrUrlInput) {
      showToast('Please enter a URL to generate a QR Code.', 'error');
      return;
    }

    openQrModal(qrUrlInput); 
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">QR Code Generator</h2>
      <p className="text-gray-700 mb-4">Generate QR codes for any URL.</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="qrUrl" className="block text-sm font-medium text-gray-700 mb-2">URL for QR Code</label>
          <input
            type="url"
            id="qrUrl"
            placeholder="e.g., https://your-website.com"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
            value={qrUrlInput}
            onChange={(e) => setQrUrlInput(e.target.value)}
          />
        </div>
        <button onClick={handleGenerateQr} className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <MdQrCode2 className="mr-2 text-xl" />
          Generate QR Code
        </button>
      </div>
      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-green-800 shadow-sm">
        <p>Easily create scannable QR codes for your links.</p>
      </div>
    </div>
  );
};

const AnalyticsSectionContent = () => {
  const mockAnalyticsData = {
    totalClicks: '1,234,567',
    clicksOverTime: [
      { name: 'Day 1', clicks: 100 },
      { name: 'Day 2', clicks: 120 },
      { name: 'Day 3', clicks: 150 },
      { name: 'Day 4', clicks: 130 },
      { name: 'Day 5', clicks: 180 },
      { name: 'Day 6', clicks: 200 },
      { name: 'Day 7', clicks: 220 },
    ],
    deviceDistribution: [
      { name: 'Desktop', value: 55, color: '#3B82F6' },
      { name: 'Mobile', value: 40, color: '#10B981' },
      { name: 'Tablet', value: 5, color: '#EF4444' },
    ],
    topCountries: [
      { name: 'USA', clicks: 40000 },
      { name: 'India', clicks: 20000 },
      { name: 'Germany', clicks: 10000 },
      { name: 'Canada', clicks: 8000 },
      { name: 'UK', clicks: 7000 },
    ],
    referrers: [
      { name: 'Google', value: 60 },
      { name: 'Facebook', value: 25 },
      { name: 'Direct', value: 15 },
      { name: 'Twitter', value: 5 },
    ],
  };

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6384'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">URL Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div className="p-5 bg-blue-50 rounded-xl border border-blue-200 text-blue-800 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium mb-2">Total Clicks</h3>
          <p className="text-4xl font-bold">{mockAnalyticsData.totalClicks}</p>
        </div>
        <div className="p-5 bg-green-50 rounded-xl border border-green-200 text-green-800 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium mb-2">Total Links</h3>
          <p className="text-4xl font-bold">100</p>
        </div>
        <div className="p-5 bg-purple-50 rounded-xl border border-purple-200 text-purple-800 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium mb-2">Active Links</h3>
          <p className="text-4xl font-bold">85</p>
        </div>
        <div className="p-5 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium mb-2">Average Clicks/Link</h3>
          <p className="text-4xl font-bold">50</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Clicks Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockAnalyticsData.clicksOverTime}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
                <YAxis tick={{ fill: '#4B5563' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                  labelStyle={{ color: '#333' }}
                  itemStyle={{ color: '#555' }}
                />
                <Legend />
                <Bar dataKey="clicks" fill="#3B82F6" name="Total Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">Daily click trends for your links.</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Device Usage</h3>
          <div className="h-64 w-full flex justify-center items-center">
            <ResponsiveContainer width="90%" height="90%">
              <PieChart>
                <Pie
                  data={mockAnalyticsData.deviceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {mockAnalyticsData.deviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                  labelStyle={{ color: '#333' }}
                  itemStyle={{ color: '#555' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">Distribution of clicks by device type.</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><MdLanguage className="mr-2 text-purple-600" /> Top Countries</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={mockAnalyticsData.topCountries}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: '#4B5563' }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#4B5563' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                  labelStyle={{ color: '#333' }}
                  itemStyle={{ color: '#555' }}
                />
                <Legend />
                <Bar dataKey="clicks" fill="#8884d8" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">Top geographical sources of your link clicks.</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Referrers</h3>
          <div className="h-64 w-full flex justify-center items-center">
            <ResponsiveContainer width="90%" height="90%">
              <PieChart>
                <Pie
                  data={mockAnalyticsData.referrers}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {mockAnalyticsData.referrers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                  labelStyle={{ color: '#333' }}
                  itemStyle={{ color: '#555' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">Sources driving traffic to your short links.</p>
        </div>

      </div>
    </div>
  );
};

const SettingsContent = () => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
    <h2 className="2xl font-semibold mb-6 text-gray-800">Account Settings</h2>
    <p className="text-gray-700">Manage your profile, preferences, and API keys.</p>
    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 shadow-sm">
      <p>Update your account details and configure integrations here.</p>
    </div>
  </div>
);

const Sidebar = ({ currentPage, setCurrentPage, isMobileSidebarOpen, toggleMobileSidebar }) => (
  <>
    {isMobileSidebarOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden" onClick={toggleMobileSidebar}></div>
    )}

    <div className={`fixed inset-y-0 left-0 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full bg-white shadow-md w-64 p-4 border-r border-gray-200 z-50`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <img src="/ShrinkX2.png" alt="ShrinkX Logo" className="h-8 w-8 rounded-full object-contain" />
          <span className="text-2xl font-bold text-gray-800">ShrinkX</span>
        </div>
        <button onClick={toggleMobileSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-md">
          <MdClose className="text-2xl" />
        </button>
      </div>
      <nav className="space-y-2 flex-grow overflow-y-auto">
        <button
          onClick={() => { setCurrentPage('Dashboard'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}
          className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'Dashboard' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <MdDashboard className="mr-3 text-xl" />
          Dashboard
        </button>
        <button
          onClick={() => { setCurrentPage('MyURLs'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}
          className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'MyURLs' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <MdOutlineLink className="mr-3 text-xl" />
          My URLs
        </button>
        <button
          onClick={() => { setCurrentPage('CreateShortLink'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}
          className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'CreateShortLink' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <MdAddLink className="mr-3 text-xl" />
          Create Short Link
        </button>
        <button
          onClick={() => { setCurrentPage('CustomAlias'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}
          className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'CustomAlias' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <MdCreate className="mr-3 text-xl" />
          Custom Alias
        </button>
        <button
          onClick={() => { setCurrentPage('ProtectedLinks'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}
          className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'ProtectedLinks' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <MdLock className="mr-3 text-xl" />
          Protected Links
        </button>
        <button
          onClick={() => { setCurrentPage('FireLinks'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}
          className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'FireLinks' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <MdLocalFireDepartment className="mr-3 text-xl" />
          Fire Links
        </button>
        <button
          onClick={() => { setCurrentPage('LocationBasedLink'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}
          className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'LocationBasedLink' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <MdLanguage className="mr-3 text-xl" />
          Location Based Link
        </button>
        <button
          onClick={() => { setCurrentPage('QrCodeGenerator'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}
          className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'QrCodeGenerator' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <MdQrCode2 className="mr-3 text-xl" />
          QR Code Generator
        </button>
        <button
          onClick={() => { setCurrentPage('Analytics'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}
          className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'Analytics' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <MdAnalytics className="mr-3 text-xl" />
          Analytics
        </button>
        <button
          onClick={() => { setCurrentPage('Settings'); if (isMobileSidebarOpen) toggleMobileSidebar(); }}
          className={`flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 ${currentPage === 'Settings' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <MdSettings className="mr-3 text-xl" />
          Settings
        </button>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
            className="flex items-center p-3 w-full text-left rounded-xl transition-colors duration-200 text-red-600 hover:bg-red-50"
        >
          <MdLogout className="mr-3 text-xl" />
          Logout
        </button>
      </div>
    </div>
  </>
);

const TopNavbar = ({ currentPageTitle, toggleMobileSidebar, user }) => (
  <div className="flex items-center justify-between bg-white shadow-sm p-4 border-b border-gray-200">
    <div className="flex items-center">
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden mr-4 text-gray-600 hover:text-gray-900 p-1 rounded-md"
      >
        <MdMenu className="text-2xl" />
      </button>
      <div className="text-xl font-semibold text-gray-800">
        {currentPageTitle}
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="relative">
        <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
          {/* ✅ Gravatar if available, else fallback icon */}
          {user?.gravatar ? (
            <img
              src={user.gravatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-3xl text-gray-600" />
          )}
          <span className="text-gray-700 hidden md:block">{user?.name}</span>
        </button>
      </div>
      <button className="flex items-center space-x-2 p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200">
        <MdLogout className="text-xl" />
        <span className="hidden md:block">Logout</span>
      </button>
    </div>
  </div>
);

const QrCodeModal = ({ qrCodeDataUrl, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (qrCodeDataUrl) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [qrCodeDataUrl]);

  const handleDownload = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-sm relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">QR Code Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <MdClose className="text-2xl" />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center">
          {loading ? (
            <div className="w-64 h-64 flex items-center justify-center border border-gray-300 rounded-xl mb-6 bg-gray-50 text-gray-500">
              Generating QR Code...
            </div>
          ) : (
            <img src={qrCodeDataUrl} alt="QR Code" className="w-64 h-64 border border-gray-300 rounded-xl mb-6" />
          )}
          
          <button 
            onClick={handleDownload} 
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading || !qrCodeDataUrl}
          >
            <MdCloudDownload className="mr-2 text-xl" />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardUI = () => {
  const [currentPage, setCurrentPage] = useState('MyURLs');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser.user);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  const openQrModal = async (urlToEncode) => {
    if (!urlToEncode) {
      showToast('No URL provided for QR code generation.', 'error');
      return;
    }

    setQrCodeDataUrl('');
    setIsQrModalOpen(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/url/generate-qr-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ url: urlToEncode }),
      });

      const data = await response.json();

      if (response.ok) {
        setQrCodeDataUrl(data.qrCodeDataUrl);
      } else {
        showToast(data.message || 'Failed to generate QR code. Please try again.', 'error');
        setQrCodeDataUrl('');
        closeQrModal();
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      showToast('An unexpected error occurred while generating QR code. Please try again.', 'error');
      setQrCodeDataUrl('');
      closeQrModal();
    }
  };

  const closeQrModal = () => {
    setIsQrModalOpen(false);
    setQrCodeDataUrl('');
  };

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const getPageTitle = (page) => {
    switch (page) {
      case 'Dashboard': return 'Dashboard Overview';
      case 'MyURLs': return 'My Shortened URLs';
      case 'CreateShortLink': return 'Create Short Link';
      case 'CustomAlias': return 'Custom Aliases';
      case 'ProtectedLinks': return 'Protected Links';
      case 'FireLinks': return 'Fire Links';
      case 'LocationBasedLink': return 'Location Based Links';
      case 'QrCodeGenerator': return 'QR Code Generator';
      case 'Analytics': return 'Advanced Analytics';
      case 'Settings': return 'Account Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMobileSidebarOpen={isMobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar
          currentPageTitle={getPageTitle(currentPage)}
          toggleMobileSidebar={toggleMobileSidebar}
          user={user}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {currentPage === 'Dashboard' && <DashboardOverviewContent user={user} />}
          {currentPage === 'MyURLs' && <MyUrlsContent openQrModal={openQrModal} showToast={showToast} API_BASE_URL={API_BASE_URL} />}
          {currentPage === 'CreateShortLink' && <CreateShortLinkContent openQrModal={openQrModal} showToast={showToast} API_BASE_URL={API_BASE_URL} />}
          {currentPage === 'CustomAlias' && <CustomAliasContent showToast={showToast} API_BASE_URL={API_BASE_URL} />}
          {currentPage === 'ProtectedLinks' && <ProtectedLinksContent showToast={showToast} />}
          {currentPage === 'FireLinks' && <FireLinksContent showToast={showToast} API_BASE_URL={API_BASE_URL} />}
          {currentPage === 'LocationBasedLink' && <LocationBasedLinkContent />}
          {currentPage === 'QrCodeGenerator' && <QrCodeGeneratorContent openQrModal={openQrModal} showToast={showToast} API_BASE_URL={API_BASE_URL} />}
          {currentPage === 'Analytics' && <AnalyticsSectionContent />}
          {currentPage === 'Settings' && <SettingsContent />}
        </main>
      </div>

      {isQrModalOpen && <QrCodeModal qrCodeDataUrl={qrCodeDataUrl} onClose={closeQrModal} />}

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
};

export default DashboardUI;
