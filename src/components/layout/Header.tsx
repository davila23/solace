import React from 'react';

/**
 * Header component with banner for the application
 * @returns {JSX.Element} Header with green banner
 */
export default function Header() {
  return (
    <header className="w-full bg-emerald-800 py-3 text-white">
      <div className="container mx-auto flex items-center justify-center px-4">
        <p className="text-sm font-medium">
          Solace Advocates are covered by your Medicare plan!{' '}
          <a href="#" className="ml-1 text-white underline hover:text-emerald-100">
            Learn more →
          </a>
        </p>
      </div>
    </header>
  );
}
