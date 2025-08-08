import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
// src/components/forms/FacultyForm.jsx
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid'; // Use CheckIcon instead of SaveIcon
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useToast } from '../../contexts/ToastContext'

function FacultyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  const isEdit = !!id

  useEffect(() => {
    if (isEdit) {
      const fetchFaculty = async () => {
        try {
          const response = await axios.get(`/api/faculty/${id}`)
          reset(response.data)
        } catch (err) {
          addToast('Failed to fetch faculty data', 'error')
        }
      }
      fetchFaculty()
    }
  }, [id, isEdit, reset, addToast])

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      if (isEdit) {
        await axios.put(`/api/faculty/${id}`, data)
        addToast('Faculty updated successfully', 'success')
      } else {
        await axios.post('/api/faculty', data)
        addToast('Faculty added successfully', 'success')
      }
      navigate('/faculty')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save faculty', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="secondary" onClick={() => navigate('/faculty')}>
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Faculty
        </Button>
        <h1 className="text-2xl font-bold ml-4">
          {isEdit ? 'Edit Faculty Member' : 'Add New Faculty Member'}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee ID
              </label>
              <input
                type="text"
                {...register('employeeId', { required: 'Employee ID is required' })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.employeeId ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
              />
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Full name is required' })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                {...register('department', { required: 'Department is required' })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.department ? 'border-red-300' : 'border-gray-300'
                } py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm`}
              >
                <option value="">Select department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Designation
              </label>
              <select
                {...register('designation', { required: 'Designation is required' })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.designation ? 'border-red-300' : 'border-gray-300'
                } py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm`}
              >
                <option value="">Select designation</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Visiting Faculty">Visiting Faculty</option>
              </select>
              {errors.designation && (
                <p className="mt-1 text-sm text-red-600">{errors.designation.message}</p>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number'
                  }
                })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Qualification */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Qualification
              </label>
              <input
                type="text"
                {...register('qualification', { required: 'Qualification is required' })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.qualification ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
              />
              {errors.qualification && (
                <p className="mt-1 text-sm text-red-600">{errors.qualification.message}</p>
              )}
            </div>

            {/* Specialization */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Specialization
              </label>
              <input
                type="text"
                {...register('specialization', { required: 'Specialization is required' })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.specialization ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
              )}
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Joining Date
              </label>
              <input
                type="date"
                {...register('joiningDate', { required: 'Joining date is required' })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.joiningDate ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
              />
              {errors.joiningDate && (
                <p className="mt-1 text-sm text-red-600">{errors.joiningDate.message}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                {...register('experience', {
                  required: 'Experience is required',
                  min: { value: 0, message: 'Experience cannot be negative' }
                })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.experience ? 'border-red-300' : 'border-gray-300'
                } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/faculty')}
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
  )
}

export default FacultyForm;