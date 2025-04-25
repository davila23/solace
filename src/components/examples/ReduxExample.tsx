'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAdvocates, setFilterParams, resetFilters, deleteAdvocate } from '../../redux/slices/advocates';
import { Role } from '../../lib/auth/types';
import { openModal, closeModal } from '../../redux/slices/ui';

/**
 * Example component demonstrating Redux usage with the advocates data
 * This serves as a template for converting existing components to use Redux
 */
export default function ReduxExample() {
  const dispatch = useAppDispatch();
  
  // Get advocates data from Redux store
  const { advocates, pagination, filterParams, status, error } = useAppSelector(state => state.advocates);
  
  // Get auth data from Redux store
  const { user, authenticated } = useAppSelector(state => state.auth);
  
  // Get UI state from Redux store
  const { modal } = useAppSelector(state => state.ui);
  
  // Load advocates data on component mount
  useEffect(() => {
    dispatch(fetchAdvocates({ 
      page: pagination.page, 
      limit: pagination.limit, 
      filters: filterParams 
    }));
  }, [dispatch, pagination.page, pagination.limit, filterParams]);
  
  // Handle search input change
  const handleSearch = (searchTerm: string) => {
    dispatch(setFilterParams({
      ...filterParams,
      search: searchTerm
    }));
  };
  
  // Handle specialty filter change
  const handleSpecialtyChange = (specialty: string) => {
    dispatch(setFilterParams({
      ...filterParams,
      specialty
    }));
  };
  
  // Handle city filter change
  const handleCityChange = (city: string) => {
    dispatch(setFilterParams({
      ...filterParams,
      city
    }));
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    dispatch(fetchAdvocates({
      page,
      limit: pagination.limit,
      filters: filterParams
    }));
  };
  
  // Open delete confirmation modal
  const handleOpenDeleteModal = (advocate: any) => {
    dispatch(openModal({
      type: 'deleteAdvocate',
      data: { advocate }
    }));
  };
  
  // Handle advocate deletion
  const handleDelete = async (id: number) => {
    await dispatch(deleteAdvocate(id));
    dispatch(closeModal());
  };
  
  // Display loading state
  if (status === 'loading' && advocates.length === 0) {
    return <div className="text-center py-8">Loading advocates...</div>;
  }
  
  // Display error state
  if (status === 'failed' && error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={() => dispatch(fetchAdvocates({ page: 1, limit: 10 }))}
          className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Advocates List (Redux Example)</h2>
      
      {/* Search and filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={filterParams.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search by name or specialty"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
          <select
            value={filterParams.specialty}
            onChange={(e) => handleSpecialtyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Specialties</option>
            {/* Render specialty options */}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            value={filterParams.city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Cities</option>
            {/* Render city options */}
          </select>
        </div>
      </div>
      
      {/* Reset filters button */}
      <div className="mb-4">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Reset Filters
        </button>
      </div>
      
      {/* Advocates table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialties
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
              {user?.role === Role.ADMIN && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {advocates.map((advocate) => (
              <tr key={advocate.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {advocate.firstName} {advocate.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {advocate.degree}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {advocate.city}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {advocate.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {advocate.yearsOfExperience} years
                </td>
                {user?.role === Role.ADMIN && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex space-x-2 justify-end">
                      <a
                        href={`/admin/advocates/add?id=${advocate.id}`}
                        className="p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors duration-200 shadow-sm flex items-center justify-center"
                        title="Edit advocate"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleOpenDeleteModal(advocate)}
                        className="p-1.5 bg-emerald-800 text-white rounded-full hover:bg-emerald-900 transition-colors duration-200 shadow-sm flex items-center justify-center"
                        title="Delete advocate"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
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
      
      {/* Pagination */}
      {pagination.totalPages > 0 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      
      {/* Modal handling (would connect with your DeleteModal component) */}
      {modal.isOpen && modal.type === 'deleteAdvocate' && modal.data && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete advocate {modal.data.advocate.firstName} {modal.data.advocate.lastName}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => dispatch(closeModal())}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(modal.data.advocate.id)}
                className="px-4 py-2 bg-emerald-800 text-white rounded-md hover:bg-emerald-900"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
