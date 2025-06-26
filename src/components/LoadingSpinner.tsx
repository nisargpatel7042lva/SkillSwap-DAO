
import React, { memo } from 'react';
import Loader from './Loader';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const motivationalMessages = [
  "Building your skill empire... 🚀",
  "Connecting you to amazing opportunities... ✨",
  "Preparing your SkillSwap journey... 🌟",
  "Loading your next big breakthrough... 💡",
  "Getting ready to swap some skills... 🤝",
  "Initializing your learning adventure... 📚",
  "Preparing the decentralized marketplace... 🌐"
];

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({ 
  message, 
  fullScreen = false 
}) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 bg-white bg-opacity-95 flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center py-8";

  const displayMessage = message || motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div className={containerClasses}>
      <Loader />
      <p className="mt-6 text-gray-700 text-lg font-medium text-center max-w-md">
        {displayMessage}
      </p>
      <div className="mt-2 flex items-center space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
