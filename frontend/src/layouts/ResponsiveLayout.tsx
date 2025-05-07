import type { ReactNode } from "react";
import { useTheme } from "../contexts/ThemeContext";

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function ResponsiveLayout({
  children,
  className = "",
}: ResponsiveLayoutProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`
        min-h-screen w-full
        transition-colors duration-200
        ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}
        ${className}
      `}
    >
      <div
        className="
        container mx-auto px-4 
      "
      >
        {children}
      </div>
    </div>
  );
}
