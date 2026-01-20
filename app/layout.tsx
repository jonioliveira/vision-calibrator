import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Vision Calibrator',
  description:
    'Evidence-based editor settings for visual comfort. Personalized recommendations for myopia, astigmatism, and color vision deficiencies.',
  keywords: [
    'editor settings',
    'eye strain',
    'visual comfort',
    'myopia',
    'astigmatism',
    'color blindness',
    'VS Code',
    'Neovim',
    'Zed',
    'JetBrains',
    'accessibility',
    'developer tools',
  ],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Vision Calibrator',
    description:
      'Evidence-based editor settings for visual comfort and reduced eye strain.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vision Calibrator',
    description:
      'Evidence-based editor settings for visual comfort and reduced eye strain.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  )
}
