import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function FormInput({
  label,
  error,
  helperText,
  className = '',
  ...props
}: FormInputProps) {
  const baseClasses = 'w-full px-3 py-2 bg-white text-gray-900 border rounded-lg transition-colors focus:outline-none focus:ring-2'
  const borderClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  const disabledClasses = 'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed'

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        className={`${baseClasses} ${borderClasses} ${disabledClasses} ${className}`}
        {...props}
      />

      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
