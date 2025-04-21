"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Pagination interface for handling paginated results
 */
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Main Home component that redirects to the advocates page
 * @returns {JSX.Element} The rendered Home component
 */
export default function Home() {
  const router = useRouter();
  
  // Redirect to advocates page on component mount
  useEffect(() => {
    router.push('/advocates');
  }, [router]);

  // Loading state shown during redirect
  return <div className="min-h-screen flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
  </div>;


}
