import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useToast } from '../../contexts/ToastContext';

function LeaveForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Submit leave application logic
      addToast('Leave application submitted successfully', 'success');
      navigate('/leave-applications');
    } catch (error) {
      addToast('Failed to submit leave application', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
        <h1 className="text-2xl font-bold ml-4">Apply for Leave</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Leave Type</label>
              <select
                {...register('leaveType', { required: 'Leave type is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              >
                <option value="">Select leave type</option>
                <option value="medical">Medical</option>
                <option value="personal">Personal</option>
                <option value="vacation">Vacation</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                  className="block w-full pl-10 rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  {...register('endDate', { required: 'End date is required' })}
                  className="block w-full pl-10 rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            {/* Reason */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <textarea
                rows={3}
                {...register('reason', { required: 'Reason is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/leave-applications')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default LeaveForm;