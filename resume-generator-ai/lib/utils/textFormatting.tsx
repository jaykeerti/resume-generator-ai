import React from 'react'

/**
 * Formats text by converting markdown syntax to React-friendly format
 * Supports both bold (**text**) and italic (*text*) markdown
 * @param text - Text that may contain **bold** and *italic* markdown
 * @returns Array of React elements with formatted text
 */
export function formatTextWithBold(text: string): (string | React.ReactElement)[] {
  if (!text) return [text]

  const parts: (string | React.ReactElement)[] = []
  // Combined regex for both **bold** and *italic* (bold must come first to match correctly)
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Check if it's bold (**text**) or italic (*text*)
    if (match[1] !== undefined) {
      // Bold text (captured by first group)
      parts.push(<strong key={key++}>{match[1]}</strong>)
    } else if (match[2] !== undefined) {
      // Italic text (captured by second group)
      parts.push(<em key={key++}>{match[2]}</em>)
    }

    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

/**
 * Renders HTML content safely as React elements
 * Used for content from the rich text editor (TipTap) which outputs HTML
 * @param html - HTML string from the rich text editor
 * @returns React element with rendered HTML
 */
export function renderHtml(html: string): React.ReactElement {
  if (!html || html.trim() === '') {
    return <></>
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className="rich-text-content"
    />
  )
}

/**
 * Smart rendering function that handles both HTML and markdown
 * Detects the format and renders appropriately:
 * - If content contains HTML tags → renders as HTML
 * - If content contains markdown **bold** → converts to React elements
 * - Otherwise → renders as plain text
 *
 * @param content - Text content that may be HTML, markdown, or plain text
 * @returns React element(s) with properly formatted content
 */
export function renderContent(content: string): React.ReactElement | (string | React.ReactElement)[] {
  if (!content || content.trim() === '') {
    return <></>
  }

  // Check if content contains HTML tags (from rich text editor)
  const hasHtmlTags = /<[^>]+>/.test(content)

  if (hasHtmlTags) {
    // Content is HTML from rich text editor
    return renderHtml(content)
  } else if (content.includes('**')) {
    // Content has markdown bold syntax (from AI)
    return formatTextWithBold(content)
  } else {
    // Plain text
    return <>{content}</>
  }
}
