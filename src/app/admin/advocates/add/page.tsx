'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import Navigation from '../../../../components/layout/Navigation';

/**
 * Admin page to add a new advocate
 * Only accessible to users with admin role
 */
export default function AddAdvocatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    degree: 'MD',
    specialties: [] as string[],
    yearsOfExperience: 1,
    phoneNumber: '',
  });
  
  // Lista predefinida de especialidades disponibles
  const [availableSpecialties, setAvailableSpecialties] = useState([
    'Bipolar', 'LGBTQ', 'Medication/Prescribing', 
    'General Mental Health', "Men's issues", "Women's issues",
    'Trauma & PTSD', 'Personal growth', 'Substance use/abuse',
    'Pediatrics', 'Chronic pain', 'Weight loss & nutrition',
    'Eating disorders', 'Life coaching'
  ]);
  
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Toggle specialty selection
   */
  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validar que se haya seleccionado al menos una especialidad
      if (selectedSpecialties.length === 0) {
        throw new Error('Please select at least one specialty');
      }

      // Validar número de teléfono
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        throw new Error('Phone number must be exactly 10 digits');
      }

      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        specialties: selectedSpecialties,
        phoneNumber: parseInt(formData.phoneNumber, 10),
        yearsOfExperience: parseInt(formData.yearsOfExperience.toString(), 10)
      };

      const response = await fetch('/api/advocates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add advocate');
      }

      // Éxito
      setSuccess(true);
      
      // Limpiar el formulario
      setFormData({
        firstName: '',
        lastName: '',
        city: '',
        degree: 'MD',
        specialties: [],
        yearsOfExperience: 1,
        phoneNumber: '',
      });
      setSelectedSpecialties([]);
      
      // Redirigir a la lista después de un breve retraso
      setTimeout(() => {
        router.push('/advocates');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-12 rounded-lg bg-white p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-gray-800">Add New Advocate</h2>
            <button
              type="button"
              onClick={() => router.push('/advocates')}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to List
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              Advocate added successfully! Redirecting...
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  disabled={loading || success}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  disabled={loading || success}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  disabled={loading || success}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="degree">
                  Degree
                </label>
                <select
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  disabled={loading || success}
                >
                  <option value="MD">MD</option>
                  <option value="PhD">PhD</option>
                  <option value="MSW">MSW</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="yearsOfExperience">
                  Years of Experience
                </label>
                <input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  disabled={loading || success}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  pattern="[0-9]{10}"
                  placeholder="5551234567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  disabled={loading || success}
                />
                <p className="text-xs text-gray-500 mt-1">10-digit number without spaces or dashes</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Specialties
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableSpecialties.map(specialty => (
                  <div key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`specialty-${specialty}`}
                      checked={selectedSpecialties.includes(specialty)}
                      onChange={() => handleSpecialtyToggle(specialty)}
                      className="mr-2"
                      disabled={loading || success}
                    />
                    <label htmlFor={`specialty-${specialty}`}>{specialty}</label>
                  </div>
                ))}
              </div>
              {selectedSpecialties.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Please select at least one specialty</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/advocates')}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading || success}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to List
              </button>
              <button
                type="submit"
                disabled={loading || success || selectedSpecialties.length === 0}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-300"
              >
                {loading ? 'Saving...' : 'Add Advocate'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
