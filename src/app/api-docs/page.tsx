'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

/**
 * API Documentation page component
 * Displays the Swagger UI documentation for the API
 */
export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    // Fetch the Swagger spec
    fetch('/api/docs')
      .then(response => response.json())
      .then(data => setSpec(data))
      .catch(error => console.error('Error fetching API docs:', error));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Solace Advocates API Documentation
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {spec ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SwaggerUI spec={spec} />
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        )}
      </main>

      <footer className="bg-white py-6 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Solace Health. API Documentation.</p>
      </footer>
    </div>
  );
}
