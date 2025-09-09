'use client'

import { useState, useRef, useEffect } from 'react'

export default function Tooling() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const builders = [
    {
      name: 'v0.app',
      description: 'design-to-deploy in minutes',
      icon: '⚡',
      features: ['AI-powered design', 'Instant deployment', 'Component library', 'No code required'],
      recommended: false
    },
    {
      name: 'Replit',
      description: 'dev + hosting + CI in one',
      icon: '🚀',
      features: ['Browser-based development', 'Instant hosting', 'Built-in CI/CD', 'No setup required'],
      recommended: true
    },
    {
      name: 'Lovable',
      description: 'describe it, ship it',
      icon: '💝',
      features: ['Natural language coding', 'Full-stack generation', 'Instant preview', 'Smart suggestions'],
      recommended: false
    }
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-gray-950/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-gradient">Builder</span>
          </h2>
          <p className="text-xl text-gray-300 mb-4">
            <strong>v0 | Replit | Lovable</strong><br />
            No one is forced into a stack they don't want.
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-orange-400 font-semibold">Private by default. You own your IP.</span>
          </p>
        </div>

        <div className={`grid md:grid-cols-3 gap-8 mb-12 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          {builders.map((builder, index) => (
            <div
              key={index}
              className={`relative p-6 border rounded-lg transition-all hover:border-orange-500/50 ${
                builder.recommended 
                  ? 'border-orange-500/50 bg-orange-950/20' 
                  : 'border-gray-800 bg-gray-950/50'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {builder.recommended && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-orange-500 text-black text-xs font-bold rounded-full">
                  RECOMMENDED
                </div>
              )}
              
              <div className="text-4xl mb-4">{builder.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{builder.name}</h3>
              <p className="text-gray-400 mb-4">{builder.description}</p>
              
              <div className="space-y-2">
                {builder.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Agent Tools */}
        <div className={`text-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <p className="text-gray-400 text-sm">
            <span className="font-semibold text-orange-400">Agents you can use:</span> Claude, Copilot, Cursor, Replit Agent—your call.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            We teach outcomes, not brand loyalty.
          </p>
        </div>
      </div>
    </section>
  )
}