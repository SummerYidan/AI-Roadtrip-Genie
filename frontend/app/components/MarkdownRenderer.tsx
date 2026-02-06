'use client'

interface MarkdownRendererProps {
  content?: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) {
    return <div className="markdown-content text-off-white/50">暂无内容</div>
  }

  // 临时使用纯文本显示,确保页面能正常加载
  return (
    <div className="markdown-content whitespace-pre-wrap">
      {content}
    </div>
  )
}
