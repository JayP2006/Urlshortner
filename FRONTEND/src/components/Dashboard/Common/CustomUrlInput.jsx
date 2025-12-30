import React from 'react';
import { MdCreate } from 'https://esm.sh/react-icons/md';


const CustomUrlInput = ({ customAlias, setCustomAlias, disabled = false }) => {
    return (
        <div>
            <label htmlFor="customAliasInput" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MdCreate className="mr-2 text-indigo-500" /> Custom Alias (Optional)
            </label>
            <div className="flex rounded-xl shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 transition duration-150">
                <span className="inline-flex items-center px-4 rounded-l-xl bg-gray-50 text-gray-500 text-sm border-r border-gray-300">
                    shrinkx.com/
                </span>
                <input
                    type="text"
                    id="customAliasInput"
                    placeholder="your-clean-alias"
                    className="flex-1 block w-full p-3 rounded-r-xl focus:outline-none disabled:bg-gray-100"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                    disabled={disabled}
                />
            </div>
            <p className="mt-2 text-xs text-gray-500">Only letters, numbers, hyphens, and underscores are allowed.</p>
        </div>
    );
};

export default CustomUrlInput;