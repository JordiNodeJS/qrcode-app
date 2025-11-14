/**
 * Application-wide constants
 */

// QR Code generation limits
export const QR_CODE_MAX_LENGTH = 2000;
export const QR_CODE_DEFAULT_WIDTH = 300;
export const QR_CODE_MIN_WIDTH = 120;
export const QR_CODE_MAX_WIDTH = 600;
export const QR_CODE_RESIZE_DEBOUNCE_MS = 150;

// Contact form validation limits
export const CONTACT_FORM_LIMITS = {
  name: { min: 2, max: 100 },
  subject: { min: 5, max: 200 },
  message: { min: 10, max: 1000 },
} as const;

// Contact form validation messages (Spanish)
export const CONTACT_FORM_ERRORS = {
  name: `El nombre debe tener entre ${CONTACT_FORM_LIMITS.name.min} y ${CONTACT_FORM_LIMITS.name.max} caracteres`,
  email: "Dirección de correo inválida",
  subject: `El asunto debe tener entre ${CONTACT_FORM_LIMITS.subject.min} y ${CONTACT_FORM_LIMITS.subject.max} caracteres`,
  message: `El mensaje debe tener entre ${CONTACT_FORM_LIMITS.message.min} y ${CONTACT_FORM_LIMITS.message.max} caracteres`,
  required: "Required",
  invalidEmail: "Invalid email",
} as const;
