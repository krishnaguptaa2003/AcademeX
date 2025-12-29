// src/components/ui/StatsCards.jsx
import {
  AcademicCapIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BookOpenIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { 
    id: 1, 
    name: 'Total Students', 
    value: '1,248', 
    change: '+4.2%',
    trend: 'up',
    icon: AcademicCapIcon,
    color: 'blue'
  },
  { 
    id: 2, 
    name: 'Total Faculty', 
    value: '48', 
    change: '+2.1%',
    trend: 'up',
    icon: UserGroupIcon,
    color: 'purple'
  },
  { 
    id: 3, 
    name: 'Courses Offered', 
    value: '32', 
    change: '+8.5%',
    trend: 'up',
    icon: BookOpenIcon,
    color: 'green'
  },
  { 
    id: 4, 
    name: 'Revenue', 
    value: '₹12.4L', 
    change: '+12.3%',
    trend: 'up',
    icon: CurrencyDollarIcon,
    color: 'amber'
  },
];

function StatsCards() {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white',
      green: 'bg-emerald-500 text-white',
      amber: 'bg-amber-500 text-white',
    };
    return colors[color] || 'bg-gray-500 text-white';
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div 
          key={stat.id} 
          className="relative bg-white rounded-2xl shadow-lg p-6 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
        >
          {/* Background pattern */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
            <stat.icon className="h-24 w-24" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  {stat.name}
                </p>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className={`ml-2 flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-xl ${getColorClasses(stat.color)} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>This month</span>
                <span>{stat.trend === 'up' ? 'Increasing' : 'Decreasing'}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    stat.color === 'blue' ? 'bg-blue-500' :
                    stat.color === 'purple' ? 'bg-purple-500' :
                    stat.color === 'green' ? 'bg-emerald-500' :
                    'bg-amber-500'
                  }`}
                  style={{ width: stat.trend === 'up' ? '75%' : '40%' }}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Compared to last month
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;