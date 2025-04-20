/**
 * Loading spinner component for indicating loading states
 * @returns {JSX.Element} Loading spinner component
 */
export default function Loading() {
  return (
    <div className="flex justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
    </div>
  );
}
