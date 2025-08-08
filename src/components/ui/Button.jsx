// src/components/ui/Button.jsx
import { forwardRef } from 'react';
import { clsx } from 'clsx'; // Make sure to install: npm install clsx

const Button = forwardRef(({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        variants[variant],
        disabled && 'opacity-75 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;