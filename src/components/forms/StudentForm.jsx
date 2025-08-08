import { useForm } from 'react-hook-form'
import { useState } from 'react'

const StudentForm = ({ onSubmit, defaultValues, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || {}
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Enrollment Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enrollment Number
          </label>
          <input
            type="text"
            {...register('enrollment', { required: 'Enrollment number is required' })}
            className={`mt-1 block w-full rounded-md border ${
              errors.enrollment ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          />
          {errors.enrollment && (
            <p className="mt-1 text-sm text-red-600">{errors.enrollment.message}</p>
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

        {/* Father's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Father's Name
          </label>
          <input
            type="text"
            {...register('fatherName', { required: "Father's name is required" })}
            className={`mt-1 block w-full rounded-md border ${
              errors.fatherName ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          />
          {errors.fatherName && (
            <p className="mt-1 text-sm text-red-600">{errors.fatherName.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            {...register('dob', { required: 'Date of birth is required' })}
            className={`mt-1 block w-full rounded-md border ${
              errors.dob ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          />
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            rows={3}
            {...register('address', { required: 'Address is required' })}
            className={`mt-1 block w-full rounded-md border ${
              errors.address ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Contact Information */}
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

        {/* Academic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Branch
          </label>
          <select
            {...register('branch', { required: 'Branch is required' })}
            className={`mt-1 block w-full rounded-md border ${
              errors.branch ? 'border-red-300' : 'border-gray-300'
            } py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm`}
          >
            <option value="">Select a branch</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical">Electrical</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>
          {errors.branch && (
            <p className="mt-1 text-sm text-red-600">{errors.branch.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course
          </label>
          <select
            {...register('course', { required: 'Course is required' })}
            className={`mt-1 block w-full rounded-md border ${
              errors.course ? 'border-red-300' : 'border-gray-300'
            } py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm`}
          >
            <option value="">Select a course</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="B.Sc">B.Sc</option>
            <option value="M.Sc">M.Sc</option>
          </select>
          {errors.course && (
            <p className="mt-1 text-sm text-red-600">{errors.course.message}</p>
          )}
        </div>

        {/* Previous Academic Performance */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class X Percentage
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register('classX', {
              required: 'Class X percentage is required',
              min: { value: 0, message: 'Percentage must be at least 0' },
              max: { value: 100, message: 'Percentage cannot exceed 100' }
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.classX ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          />
          {errors.classX && (
            <p className="mt-1 text-sm text-red-600">{errors.classX.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class XII Percentage
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register('classXII', {
              required: 'Class XII percentage is required',
              min: { value: 0, message: 'Percentage must be at least 0' },
              max: { value: 100, message: 'Percentage cannot exceed 100' }
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.classXII ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          />
          {errors.classXII && (
            <p className="mt-1 text-sm text-red-600">{errors.classXII.message}</p>
          )}
        </div>

        {/* Aadhar Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Aadhar Number
          </label>
          <input
            type="text"
            {...register('aadhar', {
              required: 'Aadhar number is required',
              pattern: {
                value: /^[0-9]{12}$/,
                message: 'Please enter a valid 12-digit Aadhar number'
              }
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.aadhar ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          />
          {errors.aadhar && (
            <p className="mt-1 text-sm text-red-600">{errors.aadhar.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default StudentForm;