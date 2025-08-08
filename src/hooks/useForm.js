// src/hooks/useForm.js
import { useState } from 'react';

export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setValues({
      ...values,
      [name]: val
    });

    if (validate) {
      setErrors(validate({
        ...values,
        [name]: val
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValues,
    setErrors
  };
};