/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from '../components/common/Pagination';
import ErrorMessage from '../components/common/ErrorMessage';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('UI Components', () => {
  describe('Pagination Component', () => {
    const mockPagination = {
      total: 50,
      page: 2,
      limit: 10,
      totalPages: 5
    };
    
    const mockChangePage = jest.fn();
    
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    test('renders pagination with correct page information', () => {
      render(
        <Pagination 
          pagination={mockPagination} 
          onPageChange={mockChangePage} 
        />
      );
      
      // Check if current page is displayed
      expect(screen.getByText('2')).toBeInTheDocument();
      
      // Check if total pages are displayed
      expect(screen.getByText('of 5')).toBeInTheDocument();
    });
    
    test('calls onPageChange when navigation buttons are clicked', () => {
      render(
        <Pagination 
          pagination={mockPagination} 
          onPageChange={mockChangePage} 
        />
      );
      
      // Click previous page button
      fireEvent.click(screen.getByLabelText('Previous page'));
      expect(mockChangePage).toHaveBeenCalledWith(1);
      
      // Click next page button
      fireEvent.click(screen.getByLabelText('Next page'));
      expect(mockChangePage).toHaveBeenCalledWith(3);
    });
    
    test('disables previous button on first page', () => {
      render(
        <Pagination 
          pagination={{...mockPagination, page: 1}} 
          onPageChange={mockChangePage} 
        />
      );
      
      // Check if previous button is disabled
      expect(screen.getByLabelText('Previous page')).toBeDisabled();
    });
    
    test('disables next button on last page', () => {
      render(
        <Pagination 
          pagination={{...mockPagination, page: 5}} 
          onPageChange={mockChangePage} 
        />
      );
      
      // Check if next button is disabled
      expect(screen.getByLabelText('Next page')).toBeDisabled();
    });
  });
  
  describe('ErrorMessage Component', () => {
    test('renders error message correctly', () => {
      const errorMessage = 'Something went wrong';
      render(<ErrorMessage message={errorMessage} />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    test('does not render when no message is provided', () => {
      const { container } = render(<ErrorMessage message="" />);
      
      // Check if component is empty
      expect(container.firstChild).toBeNull();
    });
  });
});
