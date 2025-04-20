import React from 'react';

/**
 * Error message component for displaying error notifications
 * @param {Object} props - Component props
 * @param {string} props.message - The error message to display
 * @returns {JSX.Element} Error message component
 */
export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
      {message}
    </div>
  );
}
