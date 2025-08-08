import StatsCards from '../../components/ui/StatsCards';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, UserGroupIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';

function Home() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <StatsCards />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card>
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  to="/students/new"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Add Student
                </Link>
                <Link
                  to="/faculty/new"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Add Faculty
                </Link>
                <Link
                  to="/attendance"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <BookOpenIcon className="h-5 w-5 mr-2" />
                  Mark Attendance
                </Link>
                <Link
                  to="/results"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Enter Results
                </Link>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <div className="sm:col-span-2">
            <Card>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
                <div className="mt-4">
                  <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;