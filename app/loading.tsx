import LoadingSpinner from '@/components/ui/loading-spinner';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FFFBF8]/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-[#1D1D1F] font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingPage;
