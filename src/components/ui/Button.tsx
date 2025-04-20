import React from 'react';

/**
 * Button component with different variants
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, outline)
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {Function} props.onClick - Click handler
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Button component
 */
export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) {
  // Define base styles for each variant
  const variants = {
    primary: 'bg-emerald-700 text-white hover:bg-emerald-800',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    outline: 'bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
  };
  
  // Combine all classes
  const buttonClasses = `
    rounded-md 
    px-4 py-2 
    font-medium 
    transition-colors 
    ${variants[variant]} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
    ${className}
  `;
  
  return (
    <button 
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
