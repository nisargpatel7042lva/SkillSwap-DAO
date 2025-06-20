
import React, { memo } from 'react';
import Loader from './Loader';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({ 
  message = "Loading...", 
  fullScreen = false 
}) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 bg-white bg-opacity-90 flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center py-8";

  return (
    <div className={containerClasses}>
      <Loader />
      {message && (
        <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
      )}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
