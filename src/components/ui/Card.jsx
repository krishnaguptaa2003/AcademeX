// src/components/ui/Card.jsx
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}