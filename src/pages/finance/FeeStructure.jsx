import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/ui/Card';
import { useToast } from '../../contexts/ToastContext';

function FeeStructure() {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchFeeStructures = async () => {
      try {
        const response = await axios.get('/api/fees/structure');
        setFeeStructures(response.data);
      } catch (err) {
        addToast('Failed to fetch fee structures', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFeeStructures();
  }, [addToast]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Fee Structure</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage fee structures for different courses
          </p>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {feeStructures.map((feeStructure) => (
              <Card key={feeStructure._id}>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {feeStructure.course} - {feeStructure.name}
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-500">Tuition Fee</p>
                      <p className="text-lg font-medium">₹{feeStructure.tuitionFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Examination Fee</p>
                      <p className="text-lg font-medium">₹{feeStructure.examFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Other Charges</p>
                      <p className="text-lg font-medium">₹{feeStructure.otherCharges.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Total Fee</p>
                    <p className="text-xl font-bold">₹{feeStructure.total.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeeStructure;