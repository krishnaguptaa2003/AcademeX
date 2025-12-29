// src/services/auth.js
import api from './api';

// POST /api/auth/login
export function loginRequest({ email, password }) {
  return api.post('/auth/login', { email, password });
}

// POST /api/auth/signup
export function signupRequest({ username, email, password }) {
  return api.post('/auth/signup', { username, email, password });
}

const authService = {
  loginRequest,
  signupRequest,
};

export default authService;
