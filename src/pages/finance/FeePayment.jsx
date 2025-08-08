// src/pages/finance/FeePayment.jsx
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../../contexts/ToastContext'
import { ArrowLeftIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function FeePayment() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [student, setStudent] = useState(null)
  const [feeStructure, setFeeStructure] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await axios.get(`/api/students/${studentId}`)
        setStudent(studentRes.data)
        
        const feeRes = await axios.get(`/api/fees/structure?course=${studentRes.data.course}`)
        setFeeStructure(feeRes.data)
      } catch (err) {
        addToast('Failed to fetch required data', 'error')
      }
    }
    
    fetchData()
  }, [studentId, addToast])

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      const paymentData = {
        studentId,
        amount: feeStructure.total,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        semester: '4th' // This would be dynamic in a real implementation
      }
      
      await axios.post('/api/fees/payment', paymentData)
      navigate('/payment-success', {
        state: {
          amount: feeStructure.total,
          transactionId: data.transactionId,
          studentName: student.name
        }
      })
    } catch (err) {
      addToast(err.response?.data?.message || 'Payment failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!student || !feeStructure) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold ml-4">Fee Payment</h1>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student and Fee Details */}
          <div>
            <h2 className="text-lg font-bold mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Enrollment Number</p>
                <p className="font-medium">{student.enrollment}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-medium">{student.course}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Semester</p>
                <p className="font-medium">4th Semester</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Tuition Fee</p>
                <p className="font-medium">₹{feeStructure.tuitionFee.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Examination Fee</p>
                <p className="font-medium">₹{feeStructure.examFee.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Other Charges</p>
                <p className="font-medium">₹{feeStructure.otherCharges.toLocaleString()}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-lg font-bold">Total Amount</p>
                <p className="text-2xl font-bold text-primary">₹{feeStructure.total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h2 className="text-lg font-bold mb-4">Payment Method</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="credit-card"
                      type="radio"
                      value="credit_card"
                      {...register('paymentMethod', { required: 'Payment method is required' })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor="credit-card" className="ml-2 block text-sm text-gray-900">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="net-banking"
                      type="radio"
                      value="net_banking"
                      {...register('paymentMethod')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor="net-banking" className="ml-2 block text-sm text-gray-900">
                      Net Banking
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="upi"
                      type="radio"
                      value="upi"
                      {...register('paymentMethod')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor="upi" className="ml-2 block text-sm text-gray-900">
                      UPI Payment
                    </label>
                  </div>
                </div>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
                  Transaction ID
                </label>
                <input
                  id="transactionId"
                  type="text"
                  {...register('transactionId', { required: 'Transaction ID is required' })}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.transactionId ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
                />
                {errors.transactionId && (
                  <p className="mt-1 text-sm text-red-600">{errors.transactionId.message}</p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  {loading ? 'Processing...' : `Pay ₹${feeStructure.total.toLocaleString()}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  )
}