import { Link, useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  CreditCardIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Students', href: '/students', icon: AcademicCapIcon },
  { name: 'Faculty', href: '/faculty', icon: UserGroupIcon },
  { name: 'Academics', href: '/courses', icon: BookOpenIcon },
  { name: 'Attendance', href: '/attendance', icon: CalendarIcon },
  { name: 'Finance', href: '/fee-structure', icon: CreditCardIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex h-full flex-col bg-white shadow-xl md:shadow-none">
          <div className="flex h-16 flex-shrink-0 items-center px-4 md:hidden">
            <button
              type="button"
              className="-ml-4 inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    location.pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      location.pathname === item.href
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;