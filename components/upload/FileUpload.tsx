'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
  error?: string | null
}

export function FileUpload({ onFileSelect, isLoading = false, error = null }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return 'Please upload a PDF, DOCX, or TXT file'
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return 'File size must be less than 10MB'
    }

    return null
  }

  const handleFile = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileInput}
        className="hidden"
        disabled={isLoading}
      />

      {!selectedFile ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={`
            relative cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors
            ${isDragging
              ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800'
              : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600'
            }
            ${isLoading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Upload Icon */}
            <svg
              className="h-16 w-16 text-zinc-400 dark:text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <div>
              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                {isDragging ? 'Drop your resume here' : 'Upload your existing resume'}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Drag and drop or click to browse
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                Supports PDF, DOCX, and TXT (max 10MB)
              </p>
            </div>

            <button
              type="button"
              className="mt-2 rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              onClick={(e) => {
                e.stopPropagation()
                handleButtonClick()
              }}
            >
              Choose File
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* File Icon */}
              <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                <svg
                  className="h-6 w-6 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            {!isLoading && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
