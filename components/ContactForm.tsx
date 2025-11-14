"use client";

import { useState, FormEvent, useEffect } from "react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name must not exceed 100 characters";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    } else if (formData.subject.trim().length > 200) {
      newErrors.subject = "Subject must not exceed 200 characters";
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = "Message must not exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const el = document.getElementById("contact-success");
      if (el) {
        setTimeout(() => {
          try {
            (el as HTMLElement).focus();
          } catch {}
        }, 50);
      }
    }
  }, [success]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2
        id="contact-heading"
        className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center"
      >
        Contact Us
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
        aria-labelledby="contact-heading"
        aria-describedby="contact-instructions"
      >
        <p id="contact-instructions" className="sr-only">
          All fields marked with an asterisk are required. You can expect a
          reply within 2 business days.
        </p>
        <fieldset
          aria-describedby="contact-instructions"
          className="space-y-6 border-0 p-0 m-0"
        >
          <legend className="sr-only">Contact form</legend>
          {/* Success Message */}
          {success && (
            <div
              id="contact-success"
              tabIndex={-1}
              className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400"
              role="alert"
              aria-live="assertive"
            >
              ✓ Message sent successfully! We&apos;ll get back to you soon.
            </div>
          )}

          {/* API Error Message */}
          {apiError && (
            <div
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400"
              role="alert"
              aria-live="assertive"
            >
              {apiError}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Name{" "}
              <span aria-hidden className="text-red-500">
                *
              </span>
              <span className="sr-only"> required</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              autoComplete="name"
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              aria-label="Your name"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p
                id="name-error"
                role="alert"
                aria-live="assertive"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email{" "}
              <span aria-hidden className="text-red-500">
                *
              </span>
              <span className="sr-only"> required</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              aria-label="Your email address"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                aria-live="assertive"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Subject{" "}
              <span aria-hidden className="text-red-500">
                *
              </span>
              <span className="sr-only"> required</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              maxLength={200}
              autoComplete="on"
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.subject
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              aria-label="Email subject"
              aria-required="true"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && (
              <p
                id="subject-error"
                role="alert"
                aria-live="assertive"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Message{" "}
              <span aria-hidden className="text-red-500">
                *
              </span>
              <span className="sr-only"> required</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              maxLength={1000}
              autoComplete="off"
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.message
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              aria-label="Your message"
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={
                errors.message
                  ? "message-error message-counter"
                  : "message-counter"
              }
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span id="message-counter" aria-live="polite">
                {formData.message.length} / 1000 characters
              </span>
            </div>
            {errors.message && (
              <p
                id="message-error"
                role="alert"
                aria-live="assertive"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">send</span>
                <span>Send Message</span>
              </span>
            )}
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            <span aria-hidden>*</span> Required fields
          </p>
        </fieldset>
      </form>
    </div>
  );
}
