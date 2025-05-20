import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer spinning ring */}
      <div className="absolute inset-0 rounded-full border-2 border-[#FFE4D2] border-t-[#FF7A3D] animate-[spin_0.6s_linear_infinite]"></div>
      
      {/* Inner pulsing hexagon (honey cell) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[40%] h-[40%] bg-[#FF7A3D] animate-[pulse_1s_ease-in-out_infinite]" style={{
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
        }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 