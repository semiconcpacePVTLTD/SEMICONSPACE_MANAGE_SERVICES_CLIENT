// src/utils/validation.js

export const validateUsername = (username) => {
  // Only letters and numbers, min 3 chars
  const regex = /^[A-Za-z0-9]{3,}$/;
  if (!username) return "Username is required";
  if (!regex.test(username)) return "Username must be at least 3 chars and alphanumeric";
  return "";
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!regex.test(email)) return "Invalid email format";
  return "";
};

export const validatePhone = (phone) => {
  const regex = /^\d{10}$/;
  if (!phone) return "Phone is required";
  if (!regex.test(phone)) return "Phone must be 10 digits";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8 || password.length > 15)
    return "Password must be between 8 and 15 characters";
  if (!/[A-Z]/.test(password)) return "At least one uppercase letter required";
  if (!/[a-z]/.test(password)) return "At least one lowercase letter required";
  if (!/[0-9]/.test(password)) return "At least one number required";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "At least one special character required";
  return "";
};

