import { Link } from 'react-router-dom';
import StatsCards from './components/StatsCards';

function Dashboard() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <StatsCards />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  to="/students/new"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Add Student
                </Link>
                <Link
                  to="/faculty/new"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Add Faculty
                </Link>
                <Link
                  to="/attendance"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Mark Attendance
                </Link>
                <Link
                  to="/results"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Enter Results
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
              <div className="mt-4">
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {/* Sample activity items */}
                    <li className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">
                            <span className="font-medium text-gray-900">John Doe</span> was added to students
                          </p>
                          <p className="text-sm text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">
                            <span className="font-medium text-gray-900">Jane Smith</span> submitted assignment
                          </p>
                          <p className="text-sm text-gray-500">5 hours ago</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;