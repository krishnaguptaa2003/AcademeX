// src/components/ui/PasswordInput.jsx
import { forwardRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const PasswordInput = forwardRef(function PasswordInput(
  { className = "", ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary text-sm ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
      >
        {visible ? (
          <EyeSlashIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
});

export default PasswordInput;
