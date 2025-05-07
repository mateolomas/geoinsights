
import type { ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function ResponsiveLayout({ children, className = '' }: ResponsiveLayoutProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`
        min-h-screen w-full
        transition-colors duration-200
        ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}
        ${className}
      `}
    >
      <div className="
        container mx-auto px-4 sm:px-6 lg:px-8
        py-4 sm:py-6 lg:py-8
        flex flex-col
        min-h-screen
      ">
        {children}
      </div>
    </div>
  );
}