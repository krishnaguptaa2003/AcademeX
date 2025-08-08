// src/components/ui/StatsCards.jsx
import {
  AcademicCapIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { id: 1, name: 'Total Students', value: '1,248', icon: AcademicCapIcon },
  { id: 2, name: 'Total Faculty', value: '48', icon: UserGroupIcon },
  { id: 3, name: 'Courses Offered', value: '32', icon: BookOpenIcon },
  { id: 4, name: 'Revenue', value: '$124,000', icon: CurrencyDollarIcon },
];

function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-primary hover:text-primary-dark"
              >
                View all
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;