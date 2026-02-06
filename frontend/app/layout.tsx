import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AI Roadtrip Genie - 专家级自驾路线定制',
  description: '按次收费的高端 AI 自驾路书平台，提供硬核物流保障、户外深度体验与地质科学解读',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased bg-carbon text-off-white`}>
        {children}
      </body>
    </html>
  )
}
