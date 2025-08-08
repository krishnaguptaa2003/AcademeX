import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';

const subjects = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Programming',
    department: 'Computer Science',
    credits: 4,
  },
  {
    id: 2,
    code: 'MATH201',
    name: 'Discrete Mathematics',
    department: 'Mathematics',
    credits: 3,
  },
];

function Subjects() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.includes(searchTerm)
  );

  const columns = [
    { header: 'Code', accessor: 'code' },
    { header: 'Name', accessor: 'name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Credits', accessor: 'credits' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Subjects</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all subjects offered by the university
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/subjects/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
          >
            Add Subject
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card>
          <Table columns={columns} data={filteredSubjects} />
        </Card>
      </div>
    </div>
  );
}

export default Subjects;