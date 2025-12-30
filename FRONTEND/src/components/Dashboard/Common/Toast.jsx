import React, { useEffect } from 'react';
import { MdClose } from 'https://esm.sh/react-icons/md';

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

export default Toast;