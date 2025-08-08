import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Students', path: '/students' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Academics', path: '/courses' },
  { name: 'Attendance', path: '/attendance' },
  { name: 'Finance', path: '/fee-structure' },
  { name: 'Reports', path: '/reports' },
];

function MainNav({ setSidebarOpen }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <Link to="/" className="ml-4 text-xl font-bold">
              University Management
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-secondary text-dark'
                    : 'hover:bg-primary-dark hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* User dropdown */}
          <div className="hidden md:flex items-center">
            <div className="ml-4 relative">
              <div className="flex items-center">
                <button
                  type="button"
                  className="flex rounded-full bg-primary-dark text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-white text-primary flex items-center justify-center font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-primary-dark focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-secondary text-dark'
                    : 'text-white hover:bg-primary-dark hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={logout}
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-dark hover:text-white w-full text-left"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default MainNav;