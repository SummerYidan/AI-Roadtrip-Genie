import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AI Roadtrip Genie - Expert-Led Expedition Planning',
  description: 'Premium AI-powered road trip itinerary platform with hardcore logistics, outdoor adventure, and geological insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-carbon text-off-white`}>
        {children}
      </body>
    </html>
  )
}
