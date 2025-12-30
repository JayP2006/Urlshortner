import React, { useState } from 'react';
import { FaTrash } from 'https://esm.sh/react-icons/fa';
import { motion } from "framer-motion";

const DangerZoneContent = ({ showToast, API_BASE_URL, handleLogout }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleDeleteAccount = async () => {
        setLoadingDelete(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/delete-account`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            showToast('Account deleted successfully. Logging you out.', 'info');
            
            setTimeout(() => {
                 handleLogout(); 
            }, 1000); 

        } catch (error) {
            showToast(error.message || 'Failed to delete account.', 'error');
            setLoadingDelete(false); 
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-red-300 bg-red-50">
            <h3 className="text-xl font-bold mb-4 text-red-700 flex items-center"><FaTrash className="mr-3 text-red-600" /> Account Deletion</h3>
            <p className="text-red-700 font-medium mb-5 border-l-4 border-red-500 pl-3 py-1">
                This is a permanent action. All your shortened URLs, analytics, and personal data will be completely erased.
            </p>
            
            {!confirmDelete ? (
                <button 
                    onClick={() => setConfirmDelete(true)} 
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg"
                    disabled={loadingDelete}
                >
                    Permanently Delete My Account
                </button>
            ) : (
                <motion.div 
                    className="mt-6 p-4 bg-red-100 border border-red-500 rounded-xl flex flex-col md:flex-row items-center justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <p className="font-bold text-red-800 mb-3 md:mb-0">CONFIRM: Are you absolutely sure?</p>
                    <div className="flex space-x-3">
                        <button 
                            onClick={handleDeleteAccount} 
                            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 font-medium disabled:bg-red-400 disabled:cursor-wait"
                            disabled={loadingDelete}
                        >
                            {loadingDelete ? 'Deleting...' : 'Yes, Delete It Now'}
                        </button>
                        <button 
                            onClick={() => setConfirmDelete(false)} 
                            className="px-4 py-2 bg-gray-400 text-gray-800 rounded-lg hover:bg-gray-500 font-medium"
                            disabled={loadingDelete}
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default DangerZoneContent;