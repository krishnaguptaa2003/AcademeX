import Card from '../../components/ui/Card';

const faqs = [
  {
    q: 'What is AcademeX?',
    a: 'AcademeX is a university management platform to manage students, faculty, academics and finance in one place.',
  },
  {
    q: 'Who can access the dashboard?',
    a: 'Access is role-based. Admins, faculty, and authorized staff can log in to manage their respective modules.',
  },
  {
    q: 'How is student data secured?',
    a: 'Data is stored in a secure database with role-based access control. Only authorized users can view or modify records.',
  },
  {
    q: 'Can I export reports?',
    a: 'Yes, the Reports section is designed to support exporting academic and finance reports (feature in progress).',
  },
];

function Faq() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900">Help & FAQ</h1>
      <p className="mt-1 text-sm text-gray-500">
        Answers to common questions about using the AcademeX system.
      </p>

      <div className="mt-6 space-y-4">
        {faqs.map((item, idx) => (
          <Card key={idx} className="p-4">
            <p className="text-sm font-medium text-gray-900">{item.q}</p>
            <p className="mt-2 text-sm text-gray-600">{item.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Faq;
