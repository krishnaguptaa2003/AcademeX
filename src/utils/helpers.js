// src/utils/helpers.js
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Your existing helpers
export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getInitials(name) {
  return name.split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}