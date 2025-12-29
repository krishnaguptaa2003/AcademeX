// src/components/ui/ToastContainer.jsx
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../contexts/ToastContext';

export default function ToastContainer() {
  const { toasts = [], removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex w-full max-w-sm rounded-lg shadow-lg ring-1 ring-black/5 px-4 py-3 bg-white animate-slide-in`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isError ? (
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <p
                className={`text-sm ${
                  isError ? 'text-red-800' : 'text-gray-900'
                }`}
              >
                {toast.message}
              </p>
            </div>
            <div className="ml-3 flex-shrink-0">
              <button
                onClick={() => removeToast(toast.id)}
                className="inline-flex rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
