import type { Metadata } from 'next'
import { Outfit, Playfair_Display } from 'next/font/google'
import './globals.css'

// next/font — zero layout shift, served from Next.js CDN
const outfit = Outfit({
  subsets:  ['latin'],
  variable: '--font-outfit',
  display:  'swap',
  weight:   ['300', '400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-playfair',
  display:  'swap',
  weight:   ['400', '700'],
  style:    ['normal', 'italic'],
})

export const metadata: Metadata = {
  title:       'Interactive Calendar | Wall Calendar Component',
  description: 'A polished, interactive wall-calendar-inspired component built with Next.js, TypeScript, and Tailwind CSS. Features day range selection, notes, events, multiple themes, and more.',
  keywords:    ['calendar', 'interactive', 'nextjs', 'react', 'tailwind', 'wall calendar'],
  authors:     [{ name: 'Vansh' }],
  openGraph: {
    title:       'Interactive Calendar Component',
    description: 'A beautiful wall-calendar-inspired web component',
    type:        'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-theme="classic"
      suppressHydrationWarning
      className={`${outfit.variable} ${playfair.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1565C0" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
