import React from 'react';
import { PaginationInfo } from '../../types/common/pagination';

/**
 * Pagination component for navigating through multi-page results
 * @param {Object} props - Component props
 * @param {PaginationInfo} props.pagination - Pagination state and metadata
 * @param {Function} props.onPageChange - Callback for page change events
 * @returns {JSX.Element} Pagination controls
 */
export default function Pagination({
  pagination,
  onPageChange
}: {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}) {
  /**
   * Generate an array of page numbers to display
   * @returns {number[]} Array of page numbers
   */
  const getPageNumbers = (): number[] => {
    // For smaller page counts, show all pages
    if (pagination.totalPages <= 7) {
      return Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    }
    
    // For larger page counts, show a subset with ellipsis
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;
    
    // Always include first and last page
    const pages: number[] = [1];
    
    // Logic for displaying page numbers with ellipsis
    if (currentPage <= 3) {
      // Near the start
      pages.push(2, 3, 4, 5, -1, totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push(-1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // In the middle
      pages.push(-1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages);
    }
    
    return pages;
  };
  
  // Don't render pagination if there's only one page
  if (pagination.totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="mt-6 flex justify-center">
      <nav className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className={`rounded-md px-3 py-1 ${
            pagination.page === 1 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Previous
        </button>
        
        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          page === -1 ? (
            // Ellipsis for skipped pages
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-md px-3 py-1 ${
                pagination.page === page 
                  ? "bg-emerald-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
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
        >
          Next
        </button>
      </nav>
    </div>
  );
}
