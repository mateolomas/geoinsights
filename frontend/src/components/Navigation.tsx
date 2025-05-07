import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Maps', path: '/maps' },
    { name: 'Data', path: '/data' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50
      transition-colors duration-200
      ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
      shadow-lg
    `}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">GeoInsights</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium
                  transition-colors duration-200
                  ${isActivePath(link.path)
                    ? (isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900')
                    : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
                  }
                `}
              >
                {link.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`
                p-2 rounded-full
                transition-colors duration-200
                ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              `}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="
                  px-4 py-2 rounded-md
                  bg-red-600 text-white
                  hover:bg-red-700
                  transition-colors duration-200
                "
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="
                  px-4 py-2 rounded-md
                  bg-blue-600 text-white
                  hover:bg-blue-700
                  transition-colors duration-200
                "
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                p-2 rounded-md
                transition-colors duration-200
                ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              `}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium
                  transition-colors duration-200
                  ${isActivePath(link.path)
                    ? (isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900')
                    : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="
                  w-full text-left
                  px-3 py-2 mt-2
                  rounded-md text-base font-medium
                  bg-red-600 text-white
                  hover:bg-red-700
                  transition-colors duration-200
                "
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="
                  block
                  px-3 py-2 mt-2
                  rounded-md text-base font-medium
                  bg-blue-600 text-white
                  hover:bg-blue-700
                  transition-colors duration-200
                "
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}