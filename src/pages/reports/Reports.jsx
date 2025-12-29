// src/pages/reports/Reports.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  AcademicCapIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BookOpenIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowRightIcon,
  EyeIcon,
  PrinterIcon,
  FunnelIcon, // Corrected: Changed from FilterIcon to FunnelIcon
  CalendarDaysIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const reportTypes = [
  { 
    id: 1, 
    name: 'Student Report', 
    description: 'Detailed student information and performance',
    icon: AcademicCapIcon,
    roles: ['ADMIN', 'HOD', 'DEAN'],
    endpoint: '/reports/students'
  },
  { 
    id: 2, 
    name: 'Attendance Report', 
    description: 'Attendance statistics and trends',
    icon: CalendarIcon,
    roles: ['ADMIN', 'FACULTY', 'HOD', 'DEAN'],
    endpoint: '/reports/attendance'
  },
  { 
    id: 3, 
    name: 'Academic Performance', 
    description: 'Exam results, grades and analysis',
    icon: ChartBarIcon,
    roles: ['ADMIN', 'FACULTY', 'HOD', 'DEAN'],
    endpoint: '/reports/academic'
  },
  { 
    id: 4, 
    name: 'Financial Report', 
    description: 'Fee collection, revenue and outstanding',
    icon: CurrencyDollarIcon,
    roles: ['ADMIN', 'DEAN'],
    endpoint: '/reports/financial'
  },
  { 
    id: 5, 
    name: 'Faculty Report', 
    description: 'Faculty performance and workload',
    icon: UsersIcon,
    roles: ['ADMIN', 'HOD', 'DEAN'],
    endpoint: '/reports/faculty'
  },
  { 
    id: 6, 
    name: 'Department Report', 
    description: 'Department-wise analytics and metrics',
    icon: ChartBarIcon,
    roles: ['ADMIN', 'HOD', 'DEAN'],
    endpoint: '/reports/department'
  },
];

export default function Reports() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: '',
    semester: ''
  });

  const facultyLevel = user?.facultyLevel || 'PROFESSOR';
  const userRole = user?.role || 'STUDENT';

  const filteredReports = reportTypes.filter(report => 
    report.roles.includes(userRole) || 
    (userRole === 'FACULTY' && report.roles.includes(facultyLevel))
  );

  const handleGenerateReport = async (report) => {
    setLoading(true);
    setSelectedReport(report);
    
    try {
      // Simulate API call
      setTimeout(() => {
        // Mock report data based on report type
        let mockData;
        switch(report.id) {
          case 1: // Student Report
            mockData = {
              title: 'Student Performance Report',
              generatedOn: new Date().toISOString(),
              period: 'Academic Year 2023-24',
              summary: {
                totalStudents: 1248,
                averageAttendance: 87,
                averageCGPA: 8.2,
                passRate: 92
              },
              data: [
                { id: 1, name: 'John Doe', enrollment: '2023001', course: 'B.Tech CSE', semester: 4, attendance: 92, cgpa: 8.7 },
                { id: 2, name: 'Jane Smith', enrollment: '2023002', course: 'B.Tech EE', semester: 4, attendance: 85, cgpa: 8.1 },
                { id: 3, name: 'Bob Johnson', enrollment: '2023003', course: 'B.Tech ME', semester: 4, attendance: 78, cgpa: 7.8 },
              ]
            };
            break;
          case 2: // Attendance Report
            mockData = {
              title: 'Attendance Analysis Report',
              generatedOn: new Date().toISOString(),
              period: 'November 2023',
              summary: {
                overallAttendance: 89,
                bestDepartment: 'Computer Science (94%)',
                worstDepartment: 'Civil Engineering (82%)',
                improvement: '+2.3% from last month'
              },
              data: [
                { department: 'Computer Science', attendance: 94, totalStudents: 245 },
                { department: 'Electrical', attendance: 87, totalStudents: 210 },
                { department: 'Mechanical', attendance: 85, totalStudents: 195 },
              ]
            };
            break;
          case 4: // Financial Report
            mockData = {
              title: 'Financial Collection Report',
              generatedOn: new Date().toISOString(),
              period: 'Q4 2023',
              summary: {
                totalCollected: '₹12.4L',
                pendingAmount: '₹2.1L',
                collectionRate: 86,
                topCourse: 'B.Tech CSE (₹4.2L)'
              },
              data: [
                { course: 'B.Tech CSE', collected: 420000, pending: 80000, rate: 84 },
                { course: 'B.Tech EE', collected: 310000, pending: 60000, rate: 84 },
                { course: 'B.Tech ME', collected: 290000, pending: 50000, rate: 85 },
              ]
            };
            break;
          default:
            mockData = {
              title: `${report.name} - Sample Data`,
              generatedOn: new Date().toISOString(),
              period: 'Academic Year 2023-24',
              summary: {
                totalRecords: 245,
                averageValue: 85,
                growth: '+12%'
              },
              data: [{ sample: 'Data will be generated here' }]
            };
        }
        
        setReportData(mockData);
        setLoading(false);
        addToast(`${report.name} generated successfully`, 'success');
      }, 1500);
      
    } catch (error) {
      addToast('Failed to generate report', 'error');
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    if (!selectedReport) return;
    
    addToast(`Exporting ${selectedReport.name} as ${format.toUpperCase()}...`, 'info');
    
    // In real app, this would trigger download
    setTimeout(() => {
      addToast(`${selectedReport.name} exported successfully`, 'success');
    }, 1000);
  };

  const handlePrint = () => {
    if (!selectedReport) return;
    
    addToast('Preparing report for printing...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate comprehensive reports and insights
            </p>
          </div>
          {selectedReport && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleExport('pdf')}
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleExport('excel')}
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrint}
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-500 text-white mr-3">
                  <DocumentArrowDownIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                  <p className="text-xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-500 text-white mr-3">
                  <CalendarDaysIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-500 text-white mr-3">
                  <FunnelIcon className="h-5 w-5" /> {/* Fixed: Changed FilterIcon to FunnelIcon */}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Report Types</p>
                  <p className="text-xl font-bold text-gray-900">{filteredReports.length}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      {selectedReport && (
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Report Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                >
                  <option value="">All Departments</option>
                  <option value="CS">Computer Science</option>
                  <option value="EE">Electrical</option>
                  <option value="ME">Mechanical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Semester</label>
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                >
                  <option value="">All Semesters</option>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Report Types Grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h2>
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{report.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleGenerateReport(report)}
                        disabled={loading}
                      >
                        {loading && selectedReport?.id === report.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <EyeIcon className="h-3 w-3 mr-1" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Report Preview */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Preview</h2>
          {selectedReport && reportData ? (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{reportData.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Generated: {new Date(reportData.generatedOn).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Period: {reportData.period}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {selectedReport.name}
                  </span>
                </div>

                {/* Report Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(reportData.summary).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Data Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(reportData.data[0]).map((key) => (
                          <th
                            key={key}
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {key.replace(/([A-Z])/g, ' $1')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.data.slice(0, 5).map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, colIndex) => (
                            <td key={colIndex} className="px-4 py-2 text-sm">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reportData.data.length > 5 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Showing 5 of {reportData.data.length} records
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full">
              <div className="p-12 text-center">
                <ChartBarIcon className="h-16 w-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Report Selected</h3>
                <p className="mt-2 text-gray-500">
                  Select a report type from the left to generate and preview it here.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}