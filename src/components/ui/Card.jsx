// src/components/ui/Card.jsx
import clsx from 'clsx';

export default function Card({
  title,
  subtitle,
  children,
  className = '',
  headerActions,
  padded = true,
}) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-100',
        className
      )}
    >
      {(title || subtitle || headerActions) && (
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            {title && (
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">{headerActions}</div>
          )}
        </div>
      )}
      <div className={padded ? 'px-5 pb-5 pt-3' : ''}>{children}</div>
    </div>
  );
}
