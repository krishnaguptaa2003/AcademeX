// src/components/layout/Footer.jsx (Updated)
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="md:flex md:items-center md:justify-between">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} AcademeX University Management System. All rights reserved.
          </p>

          <div className="mt-2 md:mt-0 flex items-center justify-center md:justify-end space-x-6 text-xs">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              Support
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              Terms
            </a>
            <span className="text-gray-400">v1.0.0 Beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;