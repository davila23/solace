'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import Navigation from '../../../../components/layout/Navigation';

/**
 * Admin page to add or edit an advocate
 * Only accessible to users with admin role
 */
export default function AddEditAdvocatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const advocateId = searchParams.get('id');
  const isEditMode = !!advocateId;
  
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
  const [initialLoading, setInitialLoading] = useState(isEditMode);
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
   * Load advocate data when in edit mode
   */
  useEffect(() => {
    if (isEditMode) {
      const fetchAdvocate = async () => {
        try {
          setInitialLoading(true);
          const response = await fetch(`/api/advocates/${advocateId}`);
          
          if (!response.ok) {
            throw new Error('Failed to load advocate data');
          }
          
          const advocate = await response.json();
          
          // Populate form with advocate data
          setFormData({
            firstName: advocate.firstName,
            lastName: advocate.lastName,
            city: advocate.city,
            degree: advocate.degree,
            specialties: advocate.specialties || [],
            yearsOfExperience: advocate.yearsOfExperience,
            phoneNumber: advocate.phoneNumber.toString(),
          });
          
          // Set selected specialties
          setSelectedSpecialties(advocate.specialties || []);
        } catch (err: any) {
          setError(err.message || 'Failed to load advocate data');
        } finally {
          setInitialLoading(false);
        }
      };
      
      fetchAdvocate();
    }
  }, [advocateId, isEditMode]);

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

      // Use different endpoint and method for edit vs. create
      const url = isEditMode ? `/api/advocates/${advocateId}` : '/api/advocates';
      const method = isEditMode ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add advocate');
      }

      // Éxito
      setSuccess(true);
      
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
            <h2 className="text-2xl font-medium text-gray-800">{isEditMode ? 'Edit Advocate' : 'Add New Advocate'}</h2>
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
          
          {initialLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-emerald-100 text-emerald-700 rounded-md">
                  Advocate {isEditMode ? 'updated' : 'added'} successfully! Redirecting...
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
                      <option value="LMFT">LMFT</option>
                      <option value="PsyD">PsyD</option>
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
                      Phone Number (10 digits)
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      pattern="[0-9]{10}"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                      disabled={loading || success}
                      placeholder="e.g. 5551234567"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Specialties (select at least one)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSpecialties.map((specialty) => (
                      <div 
                        key={specialty}
                        onClick={() => !loading && !success && handleSpecialtyToggle(specialty)}
                        className={`
                          p-2 border rounded-md cursor-pointer 
                          ${selectedSpecialties.includes(specialty) 
                            ? 'bg-emerald-100 border-emerald-500' 
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                          }
                          ${(loading || success) ? 'opacity-60 cursor-not-allowed' : ''}
                        `}
                      >
                        <div className="flex items-center">
                          <div className={`
                            w-4 h-4 mr-2 rounded-sm border
                            ${selectedSpecialties.includes(specialty) 
                              ? 'bg-emerald-500 border-emerald-500' 
                              : 'bg-white border-gray-400'
                            }
                          `}>
                            {selectedSpecialties.includes(specialty) && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                          <span className="text-sm">{specialty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push('/advocates')}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    disabled={loading || success}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                    disabled={loading || success || initialLoading}
                  >
                    {loading ? 'Submitting...' : isEditMode ? 'Update Advocate' : 'Add Advocate'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
