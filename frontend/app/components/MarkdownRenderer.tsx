'use client'

interface MarkdownRendererProps {
  content?: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) {
    return <div className="markdown-content text-off-white/50">No content available</div>
  }

  // Plain text display as fallback to ensure page loads correctly
  return (
    <div className="markdown-content whitespace-pre-wrap">
      {content}
    </div>
  )
}
