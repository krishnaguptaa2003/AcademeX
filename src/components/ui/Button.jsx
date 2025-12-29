// src/components/ui/Button.jsx (Enhanced)
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

const Button = forwardRef(
  (
    {
      children,
      type = 'button',
      variant = 'primary',
      size = 'md',
      className = '',
      disabled = false,
      loading = false,
      as,
      to,
      href,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary-darkest shadow-lg hover:shadow-xl',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent',
      outline: 'bg-transparent text-primary border border-primary hover:bg-primary/10',
    };

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs rounded-lg',
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-4 py-2.5 text-sm rounded-xl',
      lg: 'px-5 py-3 text-base rounded-xl',
    };

    let Component = 'button';

    if (as === 'link' && to) {
      Component = Link;
    } else if (as) {
      Component = as;
    } else if (href) {
      Component = 'a';
    }

    const isDisabled = disabled || loading;

    const baseClasses = 'inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';

    const buttonClasses = clsx(
      baseClasses,
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      loading && 'relative !text-transparent',
      className
    );

    const content = (
      <>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </span>
        )}
        {LeftIcon && !loading && (
          <LeftIcon className={clsx(
            size === 'xs' ? 'h-3 w-3' : 'h-4 w-4',
            'mr-2'
          )} />
        )}
        <span className="truncate">{children}</span>
        {RightIcon && !loading && (
          <RightIcon className={clsx(
            size === 'xs' ? 'h-3 w-3' : 'h-4 w-4',
            'ml-2'
          )} />
        )}
      </>
    );

    if (Component === 'button') {
      return (
        <button
          ref={ref}
          type={type}
          disabled={isDisabled}
          className={buttonClasses}
          {...props}
        >
          {content}
        </button>
      );
    }

    if (Component === Link) {
      return (
        <Link
          ref={ref}
          to={to}
          className={buttonClasses}
          {...props}
        >
          {content}
        </Link>
      );
    }

    if (Component === 'a') {
      return (
        <a
          ref={ref}
          href={href}
          className={buttonClasses}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <Component
        ref={ref}
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
      >
        {content}
      </Component>
    );
  }
);

Button.displayName = 'Button';
export default Button;