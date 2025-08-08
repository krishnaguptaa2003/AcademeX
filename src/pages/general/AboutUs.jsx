import { AcademicCapIcon, BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import Card from '../../components/ui/Card'

const features = [
  {
    name: 'Comprehensive Student Management',
    description: 'Efficiently manage student records, attendance, and academic performance.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Faculty Administration',
    description: 'Streamline faculty information, course assignments, and leave management.',
    icon: UserGroupIcon,
  },
  {
    name: 'Academic Excellence',
    description: 'Track courses, subjects, and student results with detailed analytics.',
    icon: BookOpenIcon,
  },
]

function AboutUs() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">About Our System</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            University Management System
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            A comprehensive solution for managing all aspects of university administration.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="mt-12 p-6">
          <h3 className="text-lg font-medium text-gray-900">Our Mission</h3>
          <p className="mt-2 text-gray-600">
            To provide educational institutions with a powerful, intuitive platform that simplifies administrative tasks, 
            enhances communication between stakeholders, and supports data-driven decision making for academic excellence.
          </p>
          
          <h3 className="mt-6 text-lg font-medium text-gray-900">Key Features</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-600">
            <li>Student information management</li>
            <li>Faculty and staff administration</li>
            <li>Course and curriculum management</li>
            <li>Attendance and leave tracking</li>
            <li>Gradebook and result processing</li>
            <li>Fee collection and financial reporting</li>
            <li>Comprehensive analytics and reporting</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default AboutUs;