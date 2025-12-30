import React, { useState, useEffect } from 'react';
import { MdClose, MdCloudDownload } from 'https://esm.sh/react-icons/md';
const QrCodeModal = ({ qrCodeDataUrl, onClose }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(!qrCodeDataUrl);
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

export default QrCodeModal;