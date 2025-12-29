// src/contexts/ToastContext.jsx (Enhanced)
import { createContext, useContext, useState } from "react";
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    
    const toast = {
      id,
      message,
      type,
      timeout: setTimeout(() => {
        removeToast(id);
      }, 5000)
    };

    setToasts(prev => [toast, ...prev.slice(0, 4)]);
  };

  const removeToast = (id) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (toast?.timeout) clearTimeout(toast.timeout);
      return prev.filter(t => t.id !== id);
    });
  };

  const getToastConfig = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50 border-emerald-200",
          text: "text-emerald-800",
          icon: <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-800",
          icon: <XCircleIcon className="h-5 w-5 text-red-500" />
        };
      case "warning":
        return {
          bg: "bg-amber-50 border-amber-200",
          text: "text-amber-800",
          icon: <ExclamationCircleIcon className="h-5 w-5 text-amber-500" />
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" />
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 w-96 max-w-[calc(100vw-2rem)]">
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          return (
            <div
              key={toast.id}
              className={`animate-slide-in-right flex items-start rounded-xl border shadow-lg p-4 ${config.bg} ${config.text}`}
              role="alert"
            >
              <div className="flex-shrink-0 mt-0.5">
                {config.icon}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}