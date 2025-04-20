'use client';

import { useRouter } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

/**
 * Unauthorized access page
 * Displayed when a user tries to access a resource they don't have permission for
 */
export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-16 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600 mb-6">403</h1>
          <h2 className="text-3xl font-medium text-gray-800 mb-4">Access Denied</h2>
          <p className="text-xl text-gray-600 mb-8">
            You don&apos;t have permission to access this page.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push('/advocates')}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Go to Advocates
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
