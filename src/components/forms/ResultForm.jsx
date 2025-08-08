import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CheckIcon as SaveIcon } from '@heroicons/react/24/solid'; // Using CheckIcon as SaveIcon
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useToast } from '../../contexts/ToastContext';

function ResultForm() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/students/${studentId}`);
        setStudent(response.data);
      } catch (err) {
        addToast('Failed to fetch student data', 'error');
      }
    };
    fetchStudent();
  }, [studentId, addToast]);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('/api/results', {
        ...data,
        studentId,
      });
      addToast('Result saved successfully', 'success');
      navigate(`/students/${studentId}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save result', 'error');
    } finally {
      setLoading(false);
    }
  };
  if (!student) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold ml-4">Enter Results for {student.name}</h1>
      </div>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <input
                type="text"
                {...register('course', { required: 'Course is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                {...register('semester', { required: 'Semester is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              >
                <option value="">Select semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Marks</label>
              <input
                type="number"
                min="0"
                max="100"
                {...register('marks', { 
                  required: 'Marks are required',
                  min: { value: 0, message: 'Marks cannot be less than 0' },
                  max: { value: 100, message: 'Marks cannot exceed 100' }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grade</label>
              <input
                type="text"
                {...register('grade', { required: 'Grade is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
export default ResultForm;