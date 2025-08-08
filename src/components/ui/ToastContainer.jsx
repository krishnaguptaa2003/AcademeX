import { XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../contexts/ToastContext';

export default function ToastContainer() {
  const { toasts = [], removeToast } = useToast(); // Provide default empty array
  
  if (!toasts || toasts.length === 0) return null; // Early return if no toasts

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-lg ${
            toast.type === 'error'
              ? 'bg-red-50 border-l-4 border-red-500'
              : 'bg-green-50 border-l-4 border-green-500'
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {toast.type === 'error' ? (
                <XMarkIcon className="h-5 w-5 text-red-500" />
              ) : (
                <XMarkIcon className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  toast.type === 'error' ? 'text-red-800' : 'text-green-800'
                }`}
              >
                {toast.message}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => removeToast(toast.id)}
                className={`-mx-1.5 -my-1.5 p-1.5 rounded-md inline-flex ${
                  toast.type === 'error'
                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                    : 'bg-green-50 text-green-500 hover:bg-green-100'
                }`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}