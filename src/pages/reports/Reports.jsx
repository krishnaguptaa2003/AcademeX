import { useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const reportTypes = [
  { id: 1, name: 'Student Report', description: 'Detailed student information' },
  { id: 2, name: 'Attendance Report', description: 'Attendance statistics' },
  { id: 3, name: 'Academic Performance', description: 'Exam results and grades' },
  { id: 4, name: 'Financial Report', description: 'Fee collection details' },
];

function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
          <p className="mt-2 text-sm text-gray-700">
            Generate and view various system reports
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((report) => (
            <Card key={report.id}>
              <div className="p-6">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-primary" />
                  <h3 className="ml-3 text-lg font-medium">{report.name}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">{report.description}</p>
                <div className="mt-4">
                  <Button
                    onClick={() => setSelectedReport(report)}
                    className="w-full"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedReport && (
          <div className="mt-8">
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">{selectedReport.name} Report</h2>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedReport(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="mt-4">
                  {/* Report content would be rendered here */}
                  <p className="text-gray-500">Report data would be displayed here</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;