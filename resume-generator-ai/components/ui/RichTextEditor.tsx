'use client'

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  showCount?: boolean
  minHeight?: string
  label?: string
  required?: boolean
  className?: string
  showToolbar?: boolean
  enableLists?: boolean
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  maxLength,
  showCount = false,
  minHeight = '150px',
  label,
  required = false,
  className = '',
  showToolbar = true,
  enableLists = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: enableLists ? {} : false,
        orderedList: enableLists ? {} : false,
        listItem: enableLists ? {} : false,
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      ...(maxLength ? [CharacterCount.configure({ limit: maxLength })] : []),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      // Only trigger onChange if content actually changed
      if (html !== value) {
        onChange(html)
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none p-3',
      },
    },
  })

  // Update editor content when value changes externally (e.g., from AI tailoring)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  const currentLength = editor.storage.characterCount?.characters() || 0
  const isOverLimit = maxLength ? currentLength > maxLength : false

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label and Character Count */}
      {(label || showCount) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {showCount && maxLength && (
            <span className={`text-xs ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}

      {/* Editor Container */}
      <div className="border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-colors">
        {/* Toolbar */}
        {showToolbar && (
          <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="Underline (Ctrl+U)"
            >
              <span className="underline">U</span>
            </ToolbarButton>

            {enableLists && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  isActive={editor.isActive('bulletList')}
                  title="Bullet List"
                >
                  <BulletListIcon />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  isActive={editor.isActive('orderedList')}
                  title="Numbered List"
                >
                  <NumberedListIcon />
                </ToolbarButton>
              </>
            )}

            <div className="w-px h-6 bg-gray-300 mx-1" />
            <ToolbarButton
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              title="Clear Formatting"
            >
              <ClearFormatIcon />
            </ToolbarButton>
          </div>
        )}

        {/* Editor Content */}
        <div style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}

// Toolbar Button Component
interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, isActive = false, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        px-2 py-1 rounded text-sm font-medium transition-colors
        ${
          isActive
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'text-gray-700 hover:bg-gray-100'
        }
      `}
    >
      {children}
    </button>
  )
}

// Icon Components
function BulletListIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
      />
    </svg>
  )
}

function NumberedListIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6h9M12 12h9M12 18h9M5 6v.01M5 12v.01M5 18v.01"
      />
    </svg>
  )
}

function ClearFormatIcon() {
  return (
    <svg
      className="w-4 h-4"
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
  )
}
