'use client';

import { useState, useEffect, useCallback } from 'react';
import { Advocate } from '../../types/advocates';
import { PaginationInfo } from '../../types/common/pagination';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Navigation from '../../components/layout/Navigation';
import Button from '../../components/ui/Button';
import Pagination from '../../components/common/Pagination';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Role } from '../../lib/auth/types';
import DeleteModal from '../../components/common/DeleteModal';

/**
 * Advocates page component
 * Displays a searchable, filterable list of healthcare advocates
 * @returns {JSX.Element} The advocates page
 */
export default function AdvocatesPage() {
  const router = useRouter();
  
  // State management
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  
  // State for delete confirmation modal
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{success: boolean; message: string} | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    specialty: '',
    city: ''
  });
  
  // Available filter options
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  /**
   * Fetches advocates data from the API
   * @param {number} page - Page number to fetch
   * @param {number} limit - Number of records per page
   * @param {Object} filterParams - Filter parameters
   */
  const fetchAdvocates = useCallback(async (
    page = 1, 
    limit = 10, 
    filterParams = filters
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (filterParams.search) params.append('search', filterParams.search);
      if (filterParams.specialty) params.append('specialty', filterParams.specialty);
      if (filterParams.city) params.append('city', filterParams.city);
      
      // Fetch data from API
      const response = await fetch(`/api/advocates?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Update state with fetched data
      setAdvocates(data.data || []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 });
      
      // Extract available filter options from data
      if (data.data && data.data.length > 0 && !filterParams.specialty && !filterParams.city) {
        // Extract and deduplicate specialties
        const allSpecialties = data.data.flatMap((advocate: Advocate) => advocate.specialties);
        const uniqueSpecialties = Array.from(new Set(allSpecialties)) as string[];
        setAvailableSpecialties(uniqueSpecialties);
        
        // Extract and deduplicate cities
        const allCities = data.data.map((advocate: Advocate) => advocate.city);
        const uniqueCities = Array.from(new Set(allCities)) as string[];
        setAvailableCities(uniqueCities);
      }
    } catch (err) {
      console.error('Error fetching advocates:', err);
      setError('Failed to load advocates data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Check authentication status and fetch user role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setUserRole(data.user.role);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    
    checkAuth();
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchAdvocates();
  }, [fetchAdvocates]);

  /**
   * Handles search input changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    
    // Debounce search to prevent excessive API calls
    const timer = setTimeout(() => {
      fetchAdvocates(1, pagination.limit, { ...filters, search: value });
    }, 500);
    
    return () => clearTimeout(timer);
  };

  /**
   * Handles specialty filter changes
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Select change event
   */
  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, specialty: value }));
    fetchAdvocates(1, pagination.limit, { ...filters, specialty: value });
  };

  /**
   * Handles city filter changes
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Select change event
   */
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, city: value }));
    fetchAdvocates(1, pagination.limit, { ...filters, city: value });
  };

  /**
   * Resets all filters
   */
  const resetFilters = () => {
    setFilters({
      search: '',
      specialty: '',
      city: ''
    });
    fetchAdvocates(1, pagination.limit, { search: '', specialty: '', city: '' });
  };

  /**
   * Handles page navigation
   * @param {number} page - Page number to navigate to
   */
  const changePage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchAdvocates(page, pagination.limit, filters);
  };

  /**
   * Formats a phone number for display
   * @param {number} phoneNumber - Raw phone number
   * @returns {string} Formatted phone number
   */
  const formatPhoneNumber = (phoneNumber: number): string => {
    const numStr = phoneNumber.toString();
    if (numStr.length === 10) {
      return `(${numStr.substring(0, 3)}) ${numStr.substring(3, 6)}-${numStr.substring(6)}`;
    }
    return numStr;
  };

  /**
   * Opens the delete confirmation modal for an advocate
   */
  const openDeleteModal = (advocate: Advocate) => {
    setSelectedAdvocate(advocate);
    setIsDeleteModalOpen(true);
  };

  /**
   * Closes the delete confirmation modal
   */
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTimeout(() => setSelectedAdvocate(null), 300);
  };

  /**
   * Handles advocate deletion
   */
  const handleDelete = async (): Promise<void> => {
    if (!selectedAdvocate) return;
    
    try {
      setDeleteStatus(null);
      
      const response = await fetch(`/api/advocates/${selectedAdvocate.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete advocate');
      }
      
      // Show success message
      setDeleteStatus({
        success: true,
        message: `Advocate deleted successfully`
      });
      
      // Refresh the data
      fetchAdvocates(pagination.page, pagination.limit, filters);
      
      // Auto-dismiss the success message after 5 seconds
      setTimeout(() => {
        setDeleteStatus(null);
      }, 5000);
    } catch (err: any) {
      setDeleteStatus({
        success: false,
        message: err.message
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-6">
          <h1 className="mb-12 text-center font-serif text-5xl font-light text-gray-900">
            Find your healthcare advocate
          </h1>
          <p className="mb-8 text-center text-lg text-gray-600">
            Our healthcare advocates are here to help you navigate your healthcare journey
          </p>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-12 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-medium text-gray-800">Solace Advocates Directory</h2>
          
          {/* Filters Section */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            {/* Search filter */}
            <div>
              <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700">
                Search by Name
              </label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={handleSearch}
                placeholder="Enter name..."
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            
            {/* Specialty filter */}
            <div>
              <label htmlFor="specialty" className="mb-2 block text-sm font-medium text-gray-700">
                Filter by Specialty
              </label>
              <select
                id="specialty"
                value={filters.specialty}
                onChange={handleSpecialtyChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">All Specialties</option>
                {availableSpecialties.map((specialty, index) => (
                  <option key={index} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            
            {/* City filter */}
            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">
                Filter by City
              </label>
              <select
                id="city"
                value={filters.city}
                onChange={handleCityChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">All Cities</option>
                {availableCities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filter actions and results count */}
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <Button 
                variant="secondary" 
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
              
              {userRole === Role.ADMIN && (
                <Button 
                  variant="primary"
                  onClick={() => router.push('/admin/advocates/add')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Advocate
                </Button>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {advocates.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} - 
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} advocates
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}
          
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Advocates table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Degree
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialties
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      {userRole === Role.ADMIN && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {advocates.map((advocate) => (
                      <tr key={advocate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium">
                                {advocate.firstName.charAt(0)}{advocate.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {advocate.firstName} {advocate.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {advocate.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {advocate.degree}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {advocate.specialties.map((specialty, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {advocate.yearsOfExperience} years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <a
                            href={`tel:${advocate.phoneNumber}`}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            {formatPhoneNumber(advocate.phoneNumber)}
                          </a>
                        </td>
                        {userRole === Role.ADMIN && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <div className="flex space-x-2 justify-end">
                              <Link
                                href={`/admin/advocates/add?id=${advocate.id}`}
                                className="p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors duration-200 shadow-sm flex items-center justify-center"
                                title="Edit advocate"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Link>
                              <button
                                onClick={() => openDeleteModal(advocate)}
                                className="p-1.5 bg-emerald-800 text-white rounded-full hover:bg-emerald-900 transition-colors duration-200 shadow-sm flex items-center justify-center"
                                title="Delete advocate"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination controls */}
              <Pagination 
                pagination={pagination}
                onPageChange={changePage}
                className="mt-8"
              />

              {/* Delete status message */}
              {deleteStatus && (
                <div className={`mt-4 p-3 rounded-md ${deleteStatus.success ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {deleteStatus.message}
                </div>
              )}

              {/* Delete confirmation modal */}
              {selectedAdvocate && (
                <DeleteModal
                  isOpen={isDeleteModalOpen}
                  title="Delete Advocate"
                  message="Are you sure you want to delete this advocate? This action cannot be undone."
                  itemName={`${selectedAdvocate.firstName} ${selectedAdvocate.lastName}`}
                  onClose={closeDeleteModal}
                  onConfirm={handleDelete}
                />
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
