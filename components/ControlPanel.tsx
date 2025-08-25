
import React from 'react';
import { PlayIcon, StopIcon } from './icons';

interface ControlPanelProps {
  hashtag: string;
  setHashtag: (value: string) => void;
  isStreaming: boolean;
  onStart: () => void;
  onStop: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ hashtag, setHashtag, isStreaming, onStart, onStop }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isStreaming) {
      onStart();
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-grow w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">#</span>
          <input
            type="text"
            value={hashtag.startsWith('#') ? hashtag.substring(1) : hashtag}
            onChange={(e) => setHashtag(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
            onKeyDown={handleKeyDown}
            placeholder="Enter campaign hashtag"
            disabled={isStreaming}
            className="w-full bg-gray-700 text-white rounded-md py-2 pl-6 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        {!isStreaming ? (
          <button
            onClick={onStart}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-200"
          >
            <PlayIcon />
            <span className="ml-2">Start Streaming</span>
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors duration-200"
          >
            <StopIcon />
            <span className="ml-2">Stop Streaming</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
