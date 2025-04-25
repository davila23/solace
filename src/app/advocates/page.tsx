'use client';

import { useState, useEffect, useCallback } from 'react';
import { Advocate } from '../../types/advocates';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Navigation from '../../components/layout/Navigation';
import Button from '../../components/ui/Button';
import Pagination from '../../components/common/Pagination';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Role } from '../../lib/auth/types';
import DeleteModal from '../../components/common/DeleteModal';

// Redux imports
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAdvocates, setFilterParams, resetFilters, deleteAdvocate } from '../../redux/slices/advocates';
import { openModal, closeModal } from '../../redux/slices/ui';

/**
 * Advocates page component
 * Displays a searchable, filterable list of healthcare advocates
 * @returns {JSX.Element} The advocates page
 */
export default function AdvocatesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get advocates data from Redux store
  const { advocates, pagination, filterParams, status, error } = useAppSelector(state => state.advocates);
  
  // Get auth data from Redux store
  const { user } = useAppSelector(state => state.auth);
  
  // Get UI state from Redux store
  const { modal } = useAppSelector(state => state.ui);
  
  // Local state for delete confirmation modal
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{success: boolean; message: string} | null>(null);
  
  // Available filter options - kept in local state since they're derived from API data
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  /**
   * Extract available filter options from advocate data
   * @param {Advocate[]} advocateData - Array of advocate data
   */
  const extractFilterOptions = useCallback((advocateData: Advocate[]) => {
    if (advocateData && advocateData.length > 0 && !filterParams.specialty && !filterParams.city) {
      // Extract and deduplicate specialties
      const allSpecialties = advocateData.flatMap((advocate: Advocate) => advocate.specialties);
      const uniqueSpecialties = Array.from(new Set(allSpecialties)) as string[];
      setAvailableSpecialties(uniqueSpecialties);
      
      // Extract and deduplicate cities
      const allCities = advocateData.map((advocate: Advocate) => advocate.city);
      const uniqueCities = Array.from(new Set(allCities)) as string[];
      setAvailableCities(uniqueCities);
    }
  }, [filterParams.specialty, filterParams.city]);

  // Initial data fetch and extract filter options when advocates data changes
  useEffect(() => {
    dispatch(fetchAdvocates({
      page: pagination.page,
      limit: pagination.limit,
      filters: filterParams
    }));
  }, [dispatch, pagination.page, pagination.limit, filterParams]);
  
  // Extract filter options when advocate data changes
  useEffect(() => {
    if (advocates.length > 0) {
      extractFilterOptions(advocates);
    }
  }, [advocates, filterParams, extractFilterOptions]);

  /**
   * Handles search input changes with debouncing
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Debounce search to prevent excessive API calls
    const timer = setTimeout(() => {
      dispatch(setFilterParams({
        ...filterParams,
        search: value
      }));
    }, 500);
    
    return () => clearTimeout(timer);
  };

  /**
   * Handles specialty filter changes
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Select change event
   */
  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setFilterParams({
      ...filterParams,
      specialty: value
    }));
  };

  /**
   * Handles city filter changes
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Select change event
   */
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setFilterParams({
      ...filterParams,
      city: value
    }));
  };

  /**
   * Resets all filters
   */
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  /**
   * Handles page navigation
   * @param {number} page - Page number to navigate to
   */
  const changePage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    dispatch(fetchAdvocates({
      page,
      limit: pagination.limit,
      filters: filterParams
    }));
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
   * Opens delete confirmation modal
   * @param {Advocate} advocate - Advocate to delete
   */
  const openDeleteModal = (advocate: Advocate) => {
    setSelectedAdvocate(advocate);
    setIsDeleteModalOpen(true);
    setDeleteStatus(null);
  };

  /**
   * Closes delete confirmation modal
   */
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAdvocate(null);
  };

  /**
   * Handles advocate deletion
   */
  const handleDeleteAdvocate = async () => {
    if (!selectedAdvocate) return;
    
    try {
      // Use Redux action to delete advocate
      await dispatch(deleteAdvocate(selectedAdvocate.id)).unwrap();
      
      // Update UI after successful deletion
      setDeleteStatus({ success: true, message: 'Advocate deleted successfully' });
      
      // Close modal after a short delay
      setTimeout(() => {
        closeDeleteModal();
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting advocate:', error);
      setDeleteStatus({ 
        success: false, 
        message: error instanceof Error ? error.message : 'An error occurred while deleting'
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
                value={filterParams.search}
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
                value={filterParams.specialty}
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
                value={filterParams.city}
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
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
              
              {user?.role === Role.ADMIN && (
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
          {status === 'loading' && advocates.length === 0 ? (
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
                      {user?.role === Role.ADMIN && (
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
                        {user?.role === Role.ADMIN && (
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

              {/* Delete confirmation modal */}
              {isDeleteModalOpen && selectedAdvocate && (
                <DeleteModal
                  isOpen={isDeleteModalOpen}
                  title="Confirm Delete"
                  message="Are you sure you want to delete this advocate?"
                  itemName={`${selectedAdvocate.firstName} ${selectedAdvocate.lastName}`}
                  onClose={closeDeleteModal}
                  onConfirm={handleDeleteAdvocate}
                />
              )}
              
              {/* Delete status notification */}
              {deleteStatus && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg max-w-md ${deleteStatus.success ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {deleteStatus.success ? (
                        <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{deleteStatus.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
