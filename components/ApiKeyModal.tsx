import React, { useState } from 'react';
import { BrandIcon } from './icons';

interface ApiKeyModalProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onApiKeySubmit }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onApiKeySubmit(key.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center text-center mb-6">
             <div className="p-3 bg-gray-900 rounded-full mb-4">
                <BrandIcon />
             </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Social Sentiment Analyzer
            </h1>
            <p className="text-gray-400 mt-2">
              Please enter your Google Gemini API key to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 sr-only">
                API Key
              </label>
              <input
                id="api-key"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                required
                className="w-full bg-gray-700 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50"
              disabled={!key.trim()}
            >
              Save and Continue
            </button>
          </form>
           <div className="text-center mt-6">
                <a 
                    href="https://ai.google.dev/gemini-api/docs/api-key" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                    Don't have a key? Get one here.
                </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;