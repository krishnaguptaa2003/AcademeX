export function validateEmail(email) {
  const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return re.test(email);
}

export function validatePhone(phone) {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
}

export function validateAadhar(aadhar) {
  const re = /^[0-9]{12}$/;
  return re.test(aadhar);
}

export function validatePercentage(percentage) {
  return percentage >= 0 && percentage <= 100;
}

export function validatePassword(password) {
  return password.length >= 8;
}