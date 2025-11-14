/**
 * Reusable form field component for inputs and textareas
 */

import React, { ChangeEvent } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  type?: "input" | "textarea";
  rows?: number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputType?: string;
}

export default function FormField({
  label,
  name,
  value,
  error,
  type = "input",
  rows = 5,
  onChange,
  inputType = "text",
}: FormFieldProps) {
  const baseClasses =
    "w-full border rounded px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={baseClasses}
        />
      ) : (
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          className={baseClasses}
        />
      )}
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
          {error}
        </div>
      )}
    </div>
  );
}
