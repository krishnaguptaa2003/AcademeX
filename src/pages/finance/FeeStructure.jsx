// src/pages/finance/FeeStructure.jsx (Enhanced)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Mock data - replace with API call
const MOCK_FEE_STRUCTURES = [
  {
    id: 1,
    name: "Bachelor of Technology - Semester 1",
    course: "B.Tech Computer Science",
    semester: 1,
    tuitionFee: 75000,
    examFee: 5000,
    otherCharges: 10000,
    total: 90000,
    status: "ACTIVE",
    createdAt: "2023-06-01"
  },
  {
    id: 2,
    name: "Bachelor of Technology - Semester 2",
    course: "B.Tech Computer Science",
    semester: 2,
    tuitionFee: 75000,
    examFee: 5000,
    otherCharges: 10000,
    total: 90000,
    status: "ACTIVE",
    createdAt: "2023-06-01"
  },
  {
    id: 3,
    name: "Bachelor of Commerce - Semester 1",
    course: "B.Com",
    semester: 1,
    tuitionFee: 45000,
    examFee: 3000,
    otherCharges: 7000,
    total: 55000,
    status: "ACTIVE",
    createdAt: "2023-06-01"
  },
  {
    id: 4,
    name: "Master of Business Administration - Semester 1",
    course: "MBA",
    semester: 1,
    tuitionFee: 120000,
    examFee: 8000,
    otherCharges: 15000,
    total: 143000,
    status: "ACTIVE",
    createdAt: "2023-06-01"
  }
];

function FeeStructure() {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    // Simulate API call
    const fetchFeeStructures = async () => {
      try {
        setLoading(true);
        // In real app: const response = await axios.get('/api/fees/structure');
        setTimeout(() => {
          setFeeStructures(MOCK_FEE_STRUCTURES);
          setLoading(false);
        }, 1000);
      } catch (err) {
        addToast('Failed to fetch fee structures', 'error');
        setLoading(false);
      }
    };
    fetchFeeStructures();
  }, [addToast]);

  const filteredFees = feeStructures.filter(fee =>
    fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id) => {
    addToast(`Edit fee structure ${id}`, 'info');
    // navigate(`/fee-structure/${id}/edit`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      setFeeStructures(prev => prev.filter(fee => fee.id !== id));
      addToast('Fee structure deleted successfully', 'success');
    }
  };

  const handleExport = () => {
    addToast('Exporting fee structures...', 'info');
    // Add export logic here
  };

  const getStatusBadge = (status) => {
    if (status === "ACTIVE") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <ClockIcon className="h-3 w-3 mr-1" />
        Inactive
      </span>
    );
  };

  const calculateTotals = () => {
    const totalAmount = feeStructures.reduce((sum, fee) => sum + fee.total, 0);
    const activeCount = feeStructures.filter(fee => fee.status === "ACTIVE").length;
    return { totalAmount, activeCount };
  };

  const totals = calculateTotals();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fee Structure Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage fee structures for different courses and semesters
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleExport}
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={() => navigate('/fee-structure/new')}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Fee Structure
              </Button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500 text-white mr-4">
                  <CurrencyDollarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fee Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{totals.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-500 text-white mr-4">
                  <AcademicCapIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Structures</p>
                  <p className="text-2xl font-bold text-gray-900">{totals.activeCount}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-500 text-white mr-4">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Courses Covered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(feeStructures.map(f => f.course)).size}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search fee structures by name or course..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Fee Structures List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : filteredFees.length === 0 ? (
          <Card className="text-center py-12">
            <CurrencyDollarIcon className="h-16 w-16 mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No fee structures found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm ? 'Try a different search term' : 'No fee structures have been created yet'}
            </p>
            {isAdmin && (
              <Button className="mt-4" onClick={() => navigate('/fee-structure/new')}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create First Fee Structure
              </Button>
            )}
          </Card>
        ) : (
          filteredFees.map((fee) => (
            <Card key={fee.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {fee.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-600">
                            {fee.course} • Semester {fee.semester}
                          </span>
                          {getStatusBadge(fee.status)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ₹{fee.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Total Fee</p>
                      </div>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-500">Tuition Fee</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{fee.tuitionFee.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-500">Examination Fee</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{fee.examFee.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-500">Other Charges</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{fee.otherCharges.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="mt-4 text-sm text-gray-500">
                      Created: {new Date(fee.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions (Admin only) */}
                  {isAdmin && (
                    <div className="flex lg:flex-col gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/fee-structure/${fee.id}/edit`)}
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(fee.id)}
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default FeeStructure;