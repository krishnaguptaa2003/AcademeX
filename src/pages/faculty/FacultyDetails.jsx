import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../contexts/ToastContext';

function FacultyDetails() {
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get(`/api/faculty/${id}`);
        setFaculty(response.data);
      } catch (err) {
        addToast('Failed to fetch faculty details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, [id, addToast]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!faculty) {
    return <div>Faculty not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="secondary" as={Link} to="/faculty">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Faculty
        </Button>
        <h1 className="text-2xl font-bold ml-4">{faculty.name}</h1>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-medium">{faculty.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{faculty.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{faculty.phone}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Professional Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{faculty.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium">{faculty.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium">{faculty.qualification}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            to={`/faculty/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Edit Faculty
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default FacultyDetails;