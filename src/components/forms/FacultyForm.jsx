import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../contexts/ToastContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid'; // Using CheckIcon instead of SaveIcon

function FacultyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      const fetchFaculty = async () => {
        try {
          const response = await axios.get(`/api/faculty/${id}`);
          reset(response.data);
        } catch (err) {
          addToast('Failed to fetch faculty data', 'error');
        }
      };
      fetchFaculty();
    }
  }, [id, isEdit, reset, addToast]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      if (isEdit) {
        await axios.put(`/api/faculty/${id}`, data);
        addToast('Faculty updated successfully', 'success');
      } else {
        await axios.post('/api/faculty', data);
        addToast('Faculty added successfully', 'success');
      }
      navigate('/faculty');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save faculty', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ... rest of your FacultyForm implementation ... */}
    </div>
  );
}

export default FacultyForm;