import React from 'react';

/**
 * Interface for filter options
 */
interface FilterOptions {
  search: string;
  specialty: string;
  city: string;
}

/**
 * Props for the AdvocateFilters component
 */
interface AdvocateFiltersProps {
  filters: FilterOptions;
  availableSpecialties: string[];
  availableCities: string[];
  onFilterChange: (filterType: string, value: string) => void;
  onReset: () => void;
  totalAdvocates: number;
  currentRange: {
    start: number;
    end: number;
  };
}

/**
 * Filtering component for advocate search
 * @param {Object} props - Component props
 * @param {FilterOptions} props.filters - Current filter values
 * @param {string[]} props.availableSpecialties - List of available specialties for filter dropdown
 * @param {string[]} props.availableCities - List of available cities for filter dropdown
 * @param {Function} props.onFilterChange - Callback when a filter changes
 * @param {Function} props.onReset - Callback to reset all filters
 * @param {number} props.totalAdvocates - Total number of advocates (for display)
 * @param {Object} props.currentRange - Current range of advocates being shown
 * @returns {JSX.Element} Filter controls for advocates
 */
export default function AdvocateFilters({
  filters,
  availableSpecialties,
  availableCities,
  onFilterChange,
  onReset,
  totalAdvocates,
  currentRange
}: AdvocateFiltersProps) {
  /**
   * Handle search input changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('search', e.target.value);
  };
  
  /**
   * Handle specialty selection changes
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Select change event
   */
  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('specialty', e.target.value);
  };
  
  /**
   * Handle city selection changes
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Select change event
   */
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange('city', e.target.value);
  };
  
  return (
    <div className="mb-8">
      {/* Filters Grid */}
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700">
            Search by Name
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Enter name..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
        
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
      
      {/* Filter controls and results count */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={onReset}
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          Reset Filters
        </button>
        
        <div className="text-sm text-gray-600">
          Showing {currentRange.start} - {currentRange.end} of {totalAdvocates} advocates
        </div>
      </div>
    </div>
  );
}
