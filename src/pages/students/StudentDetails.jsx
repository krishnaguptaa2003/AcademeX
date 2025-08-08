import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../contexts/ToastContext';

function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/students/${id}`);
        setStudent(response.data);
      } catch (err) {
        addToast('Failed to fetch student details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, addToast]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="secondary" as={Link} to="/students">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Students
        </Button>
        <h1 className="text-2xl font-bold ml-4">{student.name}</h1>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Enrollment Number</p>
                <p className="font-medium">{student.enrollment}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{new Date(student.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{student.phone}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Academic Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-medium">{student.course}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium">{student.branch}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class X Percentage</p>
                <p className="font-medium">{student.classX}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class XII Percentage</p>
                <p className="font-medium">{student.classXII}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            to={`/students/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Edit Student
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default StudentDetails;