import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://vibephx.com'),
  title: 'VibePHX - Ship a live AI-built app in one day | Phoenix',
  description: 'Sept 13 | Phoenix | $99 | Bring an idea. Leave with a working URL, repeatable workflow, and cost controls that keep AI fast—and safe.',
  keywords: 'AI development, phoenix, vibe coding, AI workshop, MVP, app deployment, Claude, Cursor, v0, deployment, localhost to production, AI guardrails, cost controls, build in public, ship fast',
  authors: [{ name: 'Cody Robertson', url: 'https://twitter.com/degendrape' }],
  creator: 'Cody Robertson',
  publisher: 'VibePHX',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://vibephx.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vibephx.com',
    title: 'VibePHX - Ship a live AI-built app in one day',
    description: 'Sept 13 | Phoenix | $99 | Deploy-first methodology with AI guardrails. Turn your Claude/Cursor skills into shipped products.',
    siteName: 'VibePHX',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'VibePHX - One day AI coding workshop in Phoenix'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@degendrape',
    creator: '@degendrape',
    title: 'VibePHX - Ship a live AI-built app in one day',
    description: 'Sept 13 | Phoenix | $99 | Deploy-first methodology with AI guardrails. Turn your Claude/Cursor skills into shipped products.',
    images: ['/og-image.jpg'],
  },
  other: {
    'event-date': '2025-09-13',
    'event-location': 'Phoenix, AZ',
    'event-price': '$99',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VibePHX" />
      </head>
      <body className={`${inter.className} bg-black text-white`}>{children}</body>
    </html>
  )
}