'use client';

import { useEffect, useState } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteModal({
  isOpen,
  title,
  message,
  itemName,
  onClose,
  onConfirm
}: DeleteModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Slight delay to ensure DOM update for animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding modal
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  // Handle deletion confirmation
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      // Slight delay before closing to show loading state
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 300);
    } catch (error) {
      setIsLoading(false);
      // Error handling would be done in the parent component
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transition-all duration-300 transform ${
          isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="bg-emerald-800 px-6 py-4 flex items-center">
          <div className="mr-3 bg-white bg-opacity-20 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        
        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-gray-700 mb-2">{message}</p>
          <p className="font-semibold text-gray-900">{itemName}</p>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-800 text-white rounded-md hover:bg-emerald-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>Delete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
