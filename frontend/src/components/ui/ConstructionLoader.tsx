import React from 'react';
import { HardHat } from 'lucide-react';

interface ConstructionLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConstructionLoader({ size = 'md', className = '' }: ConstructionLoaderProps) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const iconSizeMap = {
    sm: 14,
    md: 20,
    lg: 32
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <div className={`relative flex items-center justify-center ${sizeMap[size]}`}>
        {/* Outer spinning dashed ring */}
        <div className="absolute inset-0 border-[3px] border-dashed border-amber-500 rounded-full animate-[spin_3s_linear_infinite] opacity-80" />
        {/* Inner pulsing hardhat */}
        <HardHat size={iconSizeMap[size]} className="text-amber-600 animate-pulse" strokeWidth={2.5} />
      </div>
    </div>
  );
}
