import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { PencilIcon, TrashIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import { useToast } from '../../contexts/ToastContext'

function FacultyList() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get('/api/faculty')
        setFaculty(response.data)
      } catch (err) {
        addToast('Failed to fetch faculty data', 'error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchFaculty()
  }, [addToast])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await axios.delete(`/api/faculty/${id}`)
        setFaculty(faculty.filter(member => member._id !== id))
        addToast('Faculty member deleted successfully', 'success')
      } catch (err) {
        addToast('Failed to delete faculty member', 'error')
      }
    }
  }

  const columns = [
    { header: 'Employee ID', accessor: 'employeeId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Actions',
      accessor: '_id',
      Cell: ({ value }) => (
        <div className="flex space-x-2">
          <Link
            to={`/faculty/${value}`}
            className="text-gray-600 hover:text-gray-900"
            title="View Details"
          >
            <UserIcon className="h-5 w-5" />
          </Link>
          <Link
            to={`/faculty/${value}/edit`}
            className="text-primary hover:text-primary-dark"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={() => handleDelete(value)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Faculty Management</h1>
        <Link to="/faculty/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Faculty
          </Button>
        </Link>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table columns={columns} data={faculty} />
        )}
      </Card>
    </div>
  )
}

export default FacultyList;