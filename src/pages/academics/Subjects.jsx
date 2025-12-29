// src/pages/academics/Subjects.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const demoSubjects = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Programming",
    department: "Computer Science",
    credits: 4,
  },
  {
    id: 2,
    code: "MATH201",
    name: "Discrete Mathematics",
    department: "Mathematics",
    credits: 3,
  },
];

function Subjects() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubjects = demoSubjects.filter((subject) => {
    const term = searchTerm.toLowerCase();
    return (
      subject.name.toLowerCase().includes(term) ||
      subject.code.toLowerCase().includes(term) ||
      subject.department.toLowerCase().includes(term)
    );
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Subjects</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all subjects offered by the university.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/subjects/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark"
          >
            Add Subject
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative mb-4 max-w-md">
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

        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 sm:pl-6">
                  Code
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">
                  Name
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">
                  Department
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500">
                  Credits
                </th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-sm">
              {filteredSubjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 font-medium text-gray-900 sm:pl-6">
                    {subject.code}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-700">
                    {subject.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-700">
                    {subject.department}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-700">
                    {subject.credits}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-6">
                    <Link
                      to={`/subjects/${subject.id}/edit`}
                      className="text-primary hover:text-primary-dark text-sm font-semibold"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {!filteredSubjects.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-xs text-gray-400"
                  >
                    No subjects match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Subjects;
