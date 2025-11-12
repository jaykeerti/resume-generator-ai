/**
 * Formats text by converting markdown bold syntax (**text**) to React-friendly format
 * @param text - Text that may contain **bold** markdown
 * @returns Array of React elements with bold text wrapped in <strong> tags
 */
export function formatTextWithBold(text: string): (string | JSX.Element)[] {
  if (!text) return [text]

  const parts: (string | JSX.Element)[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Add bold text
    parts.push(<strong key={key++}>{match[1]}</strong>)

    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}
