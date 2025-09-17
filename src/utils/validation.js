// src/utils/validation.js

// Basic field validators
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
  // At least 8 chars, one uppercase, one lowercase, one number, one special char
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password) return "Password is required";
  if (!regex.test(password)) return "Password must be at least 8 chars with uppercase, lowercase, number & special char";
  return "";
};

// Role-specific validators
export const validatePAN = (pan) => {
  if (!pan) return "PAN number is required";
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan) ? "" : "Invalid PAN format";
};

export const validateGST = (gst) => {
  if (!gst) return "GST number is required";
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)
    ? ""
    : "Invalid GST format";
};

export const validateMCA = (mca) => {
  if (!mca) return "MCA number is required";
  return /^[A-Z0-9]{6,15}$/.test(mca) ? "" : "Invalid MCA number";
};

// File/image validator with size check and required
export const validateImage = (file, label = "Image", maxMB = 5) => {
  if (!file) return `${label} is required`;
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) return `${label} must be ≤ ${maxMB}MB`;
  return "";
};