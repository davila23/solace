import React from 'react';
import { Advocate } from '../../types/advocates';

/**
 * Table component for displaying advocate data
 * @param {Object} props - Component props
 * @param {Advocate[]} props.advocates - Array of advocate data to display
 * @param {boolean} props.loading - Whether the data is currently loading
 * @returns {JSX.Element} Table displaying advocate information
 */
export default function AdvocateTable({ 
  advocates, 
  loading 
}: { 
  advocates: Advocate[]; 
  loading: boolean;
}) {
  /**
   * Formats a phone number into a readable format
   * @param {number} number - The phone number to format
   * @returns {string} The formatted phone number
   */
  const formatPhoneNumber = (number: number): string => {
    const numStr = number.toString();
    if (numStr.length === 10) {
      return `(${numStr.substring(0, 3)}) ${numStr.substring(3, 6)}-${numStr.substring(6)}`;
    }
    return numStr;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
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
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {specialty}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {advocate.yearsOfExperience} years
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <a href={`tel:${advocate.phoneNumber}`} className="text-emerald-600 hover:text-emerald-900">
                  {formatPhoneNumber(advocate.phoneNumber)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
