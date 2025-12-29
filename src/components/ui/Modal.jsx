// src\components\ui\Modal.jsx
export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[500px]">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
 