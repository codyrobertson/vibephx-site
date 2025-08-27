import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'VibePHX - AI-Powered App Builder',
    template: '%s | VibePHX'
  },
  description: 'Build production-ready applications in hours, not weeks. AI-assisted development with modern tech stacks.',
  keywords: ['AI', 'app builder', 'development', 'React', 'Next.js', 'automation'],
  authors: [{ name: 'VibePHX Team' }],
  creator: 'VibePHX',
  metadataBase: new URL('https://vibephx.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vibephx.com',
    title: 'VibePHX - AI-Powered App Builder',
    description: 'Build production-ready applications in hours, not weeks.',
    siteName: 'VibePHX',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VibePHX - AI-Powered App Builder'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibePHX - AI-Powered App Builder',
    description: 'Build production-ready applications in hours, not weeks.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={cn(inter.variable)} suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        'scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent'
      )}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            
            <main className="flex-1">
              {children}
            </main>
            
            <Footer />
          </div>
          
          <Toaster />
        </Providers>
        
        {/* Analytics and monitoring scripts */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script
              defer
              data-domain="vibephx.com"
              src="https://plausible.io/js/script.js"
            />
            
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.va = window.va || function () { 
                    (window.vaq = window.vaq || []).push(arguments); 
                  };
                `
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}