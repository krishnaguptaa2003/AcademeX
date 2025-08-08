import { useState } from 'react'
import { DocumentTextIcon, CalculatorIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const utilityItems = [
  {
    name: 'Grade Calculator',
    description: 'Calculate final grades based on assessment scores',
    icon: CalculatorIcon,
    action: () => alert('Grade Calculator will open')
  },
  {
    name: 'Attendance Tracker',
    description: 'View and analyze attendance patterns',
    icon: ChartBarIcon,
    action: () => alert('Attendance Tracker will open')
  },
  {
    name: 'Academic Calendar',
    description: 'View important dates and events',
    icon: CalendarIcon,
    action: () => alert('Academic Calendar will open')
  },
  {
    name: 'Document Generator',
    description: 'Generate ID cards, certificates, and reports',
    icon: DocumentTextIcon,
    action: () => alert('Document Generator will open')
  }
]

function Utilities() {
  const [selectedUtility, setSelectedUtility] = useState(null)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Utilities</h1>
      
      <Card>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {utilityItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="group relative bg-white py-6 px-4 flex flex-col items-center text-center rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="rounded-full bg-primary-50 p-3 group-hover:bg-primary-100 transition-colors">
                <item.icon className="h-8 w-8 text-primary group-hover:text-primary-dark" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{item.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{item.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {selectedUtility && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{selectedUtility.name}</h2>
            <p>Utility implementation would go here</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Utilities;