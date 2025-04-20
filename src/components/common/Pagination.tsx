import React from 'react';
import { PaginationInfo } from '../../lib/common/types';

/**
 * Generic Pagination component for navigating through multi-page results
 * @param {Object} props - Component props
 * @param {PaginationInfo} props.pagination - Pagination state and metadata
 * @param {Function} props.onPageChange - Callback for page change events
 * @param {string} [props.className] - Optional additional CSS class
 * @returns {JSX.Element | null} Pagination controls or null if only one page
 */
export default function Pagination({
  pagination,
  onPageChange,
  className = '',
}: {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  /**
   * Generate an array of page numbers to display
   * @returns {(number | string)[]} Array of page numbers or ellipsis markers
   */
  const getPageNumbers = (): (number | string)[] => {
    // For smaller page counts, show all pages
    if (pagination.totalPages <= 7) {
      return Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    }
    
    // For larger page counts, show a subset with ellipsis
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;
    
    // Always include first and last page
    const pages: (number | string)[] = [1];
    
    // Logic for displaying page numbers with ellipsis
    if (currentPage <= 3) {
      // Near the start
      pages.push(2, 3, 4, 5, 'ellipsis-1', totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push('ellipsis-1', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // In the middle
      pages.push('ellipsis-1', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-2', totalPages);
    }
    
    return pages;
  };
  
  // Don't render pagination if there's only one page
  if (pagination.totalPages <= 1) {
    return null;
  }
  
  return (
    <div className={`mt-6 flex justify-center ${className}`}>
      <nav className="flex items-center space-x-2" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className={`rounded-md px-3 py-1 ${
            pagination.page === 1 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-label="Previous page"
        >
          Previous
        </button>
        
        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          typeof page === 'string' ? (
            // Ellipsis for skipped pages
            <span key={page} className="px-2 text-gray-500" aria-hidden="true">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-md px-3 py-1 ${
                pagination.page === page 
                  ? "bg-emerald-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-label={`Page ${page}`}
              aria-current={pagination.page === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
        
        {/* Next button */}
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className={`rounded-md px-3 py-1 ${
            pagination.page === pagination.totalPages 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-label="Next page"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
