import { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';

function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);

  const columns = [
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Attendance</h1>
          <p className="mt-2 text-sm text-gray-700">
            Mark and manage student attendance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <Table columns={columns} data={attendance} />
        </Card>
      </div>
    </div>
  );
}

export default Attendance;