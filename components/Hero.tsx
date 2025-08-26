'use client'

import { useState, useEffect } from 'react'

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 md:px-8 lg:px-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-black to-red-900/20" />
      
      {/* Animated background dots */}
      {mounted && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
                animationDelay: `${(i * 0.1) % 5}s`,
                animationDuration: `${3 + (i * 0.08) % 4}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Date Badge */}
        <div className={`inline-flex items-center px-4 py-2 mb-8 border border-orange-500/30 rounded-full bg-orange-500/10 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
          <span className="text-orange-400 font-semibold">Oct 4, 2025</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-gray-300">Phoenix, AZ</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-gray-300">9AM - 5PM</span>
        </div>

        {/* Main Headline */}
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
          <span className="text-white">Ship a live AI-built app</span>
          <br />
          <span className="text-gradient">in one day.</span>
        </h1>

        {/* Subheadline */}
        <p className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
          Bring an idea. Leave with a working URL—or a deploy-ready pipeline and next steps—plus a repeatable AI workflow and cost controls.
        </p>

        {/* Value Props */}
        <div className={`flex flex-wrap justify-center gap-6 mb-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300">Working URL or deploy pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300">Repeatable AI workflow</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300">Cost controls included</span>
          </div>
        </div>

        {/* Trust Card */}
        <div className={`max-w-2xl mx-auto mb-8 p-4 bg-gray-950/50 border border-gray-800 rounded-lg ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-4">
            <img 
              src="/cody-photo.png" 
              alt="Cody Robertson" 
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-semibold text-white">Cody Robertson</div>
                <span className="px-2 py-0.5 bg-orange-500 text-black text-xs font-bold rounded-full">
                  YOUR MENTOR
                </span>
              </div>
              <div className="text-sm text-gray-400">10+ yrs shipping products to 100K+ users. Built dozens of AI-assisted apps with Cursor/Claude. Local, hands-on, no fluff.</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className={`flex justify-center ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <a 
            href="https://luma.com/cvlfi81t"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-bold text-lg hover:scale-105 transition-transform glow"
          >
            Reserve Your Spot — $99
          </a>
        </div>

        {/* Trust Indicators */}
        <div className={`mt-8 flex flex-col items-center gap-6 ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span>Limited to 20 seats</span>
            <span>•</span>
            <span>Pilot cohort</span>
            <span>•</span>
            <span>Lunch included</span>
          </div>
          <div className="text-xs text-gray-600 text-center">
            <span className="text-gray-400">Aligned with best practices from:</span>
            <span className="text-gray-300 font-semibold ml-2">Replit • Microsoft Learn • v0.app</span>
            <span className="text-gray-500 ml-2">(no affiliation implied)</span>
          </div>
        </div>
      </div>
    </section>
  )
}