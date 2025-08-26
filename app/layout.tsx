import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://vibephx.com'),
  title: {
    default: 'VibePHX - Ship a live AI-built app in one day | Phoenix',
    template: '%s | VibePHX'
  },
  description: 'Sept 13, 2025 | Phoenix | $99 | One-day workshop for AI-curious builders. Turn your Claude/Cursor skills into deployed products. Working URL by 5pm guaranteed.',
  keywords: [
    'AI development workshop',
    'Phoenix tech events',
    'vibe coding',
    'AI workshop',
    'MVP development',
    'app deployment',
    'Claude AI',
    'Cursor IDE', 
    'v0 vercel',
    'deployment workshop',
    'localhost to production',
    'AI cost controls',
    'build in public',
    'ship fast',
    'Phoenix startup',
    'developer workshop',
    'AI tools training',
    'no code development',
    'rapid prototyping',
    'tech meetup phoenix'
  ],
  authors: [{ name: 'Cody Robertson', url: 'https://twitter.com/mackody_' }],
  creator: 'Cody Robertson',
  publisher: 'VibePHX',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://vibephx.com',
  },
  category: 'Technology',
  classification: 'Educational Event',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vibephx.com',
    title: 'VibePHX - Ship a live AI-built app in one day',
    description: 'Sept 13, 2025 | Phoenix | $99 | One-day workshop for AI-curious builders. Working URL by 5pm guaranteed.',
    siteName: 'VibePHX',
    images: [{
      url: '/api/og',
      width: 1200,
      height: 630,
      alt: 'VibePHX - One day AI coding workshop in Phoenix',
      type: 'image/png'
    }],
    countryName: 'United States',
    ttl: 86400,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mackody_',
    creator: '@mackody_',
    title: 'VibePHX - Ship a live AI-built app in one day',
    description: 'Sept 13, 2025 | Phoenix | $99 | One-day workshop for AI-curious builders. Working URL by 5pm guaranteed.',
    images: [{
      url: '/api/og',
      alt: 'VibePHX - One day AI coding workshop in Phoenix'
    }],
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
        
        {/* Structured Data for Event */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "VibePHX - Ship a live AI-built app in one day",
              "description": "One-day workshop for AI-curious builders who use Claude/Cursor but struggle with deployment. Learn to ship live MVPs with AI tools and cost controls.",
              "startDate": "2025-09-13T09:00:00-07:00",
              "endDate": "2025-09-13T17:00:00-07:00",
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": {
                "@type": "Place",
                "name": "Phoenix, AZ",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Phoenix",
                  "addressRegion": "AZ",
                  "addressCountry": "US"
                }
              },
              "image": "https://vibephx.com/api/og",
              "organizer": {
                "@type": "Person",
                "name": "Cody Robertson",
                "url": "https://twitter.com/mackody_"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://vibephx.com",
                "price": "99",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "validFrom": "2025-01-01T00:00:00-07:00"
              },
              "performer": {
                "@type": "Person",
                "name": "Cody Robertson",
                "description": "10+ years shipping products to 100K+ users"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-black text-white`}>{children}</body>
    </html>
  )
}