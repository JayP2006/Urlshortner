import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdQrCode2, MdContentCopy, MdLink, MdChevronRight } from 'https://esm.sh/react-icons/md';
const QrCodeGeneratorContent = ({ openQrModal, showToast }) => {
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false); // Local loading state for generation feedback

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!inputText) {
            showToast('Please enter text or a URL to generate a QR code.', 'error');
            return;
        }
        
        setLoading(true);
        openQrModal(inputText);
        setTimeout(() => setLoading(false), 500); 
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Universal QR Code Generator</h2>
            <p className="text-gray-500 mb-8">Generate a clean, high-resolution QR code instantly from any link or block of text.</p>
            
            <form onSubmit={handleGenerate} className="space-y-8">
                <div>
                    <label htmlFor="qr-input" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <MdLink className="mr-2 text-indigo-500" /> URL or Text Input
                    </label>
                    <input
                        id="qr-input"
                        type="text"
                        placeholder="e.g., https://your-website.com/contact or product ID #405"
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-inner outline-none transition disabled:bg-gray-50"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <p className="mt-2 text-xs text-gray-500">The QR code will embed this exact data.</p>
                </div>

                <div className="flex items-center pt-4 border-t border-gray-100 justify-end">
                    <button
                        type="submit"
                        className="flex items-center justify-center px-8 py-3 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition focus:ring-4 focus:ring-indigo-200 w-full sm:w-auto disabled:bg-indigo-400 disabled:cursor-wait"
                        disabled={loading || !inputText.trim()}
                    >
                        {loading ? 'Generating...' : (
                            <>
                                <MdQrCode2 className="mr-2 text-xl" />
                                Generate & Preview Code
                            </>
                        )}
                        <MdChevronRight className="ml-1 text-xl" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QrCodeGeneratorContent;