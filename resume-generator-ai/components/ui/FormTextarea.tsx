import React from 'react'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  maxLength?: number
  showCount?: boolean
}

export function FormTextarea({
  label,
  error,
  helperText,
  maxLength,
  showCount = false,
  className = '',
  ...props
}: FormTextareaProps) {
  const baseClasses = 'w-full px-3 py-2 bg-white text-gray-900 border rounded-lg transition-colors focus:outline-none focus:ring-2 resize-y'
  const borderClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  const disabledClasses = 'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed'

  const currentLength = props.value?.toString().length || 0
  const isOverLimit = maxLength ? currentLength > maxLength : false

  return (
    <div className="space-y-1">
      {(label || showCount) && (
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {showCount && maxLength && (
            <span className={`text-xs ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        className={`${baseClasses} ${borderClasses} ${disabledClasses} ${className}`}
        maxLength={maxLength}
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
