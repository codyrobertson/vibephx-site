'use client'

import { useState, useRef, useEffect } from 'react'

export default function Methodology() {
  const [activeStep, setActiveStep] = useState(0)
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

  const steps = [
    {
      number: '01',
      title: 'Deployment Setup First',
      description: 'Before writing a single line of code, we set up hosting, domain, and CI/CD. This eliminates the #1 blocker.',
      icon: '🚀',
      tools: ['Vercel', 'Netlify', 'Railway']
    },
    {
      number: '02', 
      title: 'AI-Assisted Development',
      description: 'Use Claude and Cursor to write clean, functional code. Learn to prompt effectively and catch AI hallucinations.',
      icon: '🤖',
      tools: ['Claude', 'Cursor', 'GitHub Copilot']
    },
    {
      number: '03',
      title: 'Continuous Deployment',
      description: 'Every change goes live immediately. See your app evolve in real-time, get feedback fast, iterate quickly.',
      icon: '🔄',
      tools: ['GitHub Actions', 'Vercel', 'Live URLs']
    },
    {
      number: '04',
      title: 'Production-Ready Patterns',
      description: 'Error handling, environment variables, database connections. Build apps that scale, not just demos.',
      icon: '⚡',
      tools: ['Error Boundaries', 'Env Vars', 'Production DBs']
    }
  ]


  return (
    <section ref={sectionRef} className="py-20 px-6 md:px-8 lg:px-12 bg-gradient-to-b from-gray-900/30 to-black">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The <span className="text-gradient">Vibe Coding</span> Methodology
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            The systematic approach to AI-assisted development that actually ships
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Used by builders at:</span>
            <span className="text-orange-400 font-semibold">Microsoft</span>
            <span>•</span>
            <span className="text-orange-400 font-semibold">Replit</span>
            <span>•</span>
            <span className="text-orange-400 font-semibold">Vercel</span>
          </div>
        </div>

        {/* The 4-Step Process */}
        <div className={`mb-20 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold text-center mb-12">The 4-Step Process</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-6 border rounded-lg transition-all cursor-pointer ${
                  activeStep === index 
                    ? 'border-orange-500 bg-orange-950/20' 
                    : 'border-gray-800 hover:border-orange-500/50'
                }`}
                onClick={() => setActiveStep(index)}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-2xl font-bold text-orange-400">{step.number}</span>
                </div>
                
                <h4 className="font-semibold mb-3 text-lg">{step.title}</h4>
                <p className="text-gray-400 text-sm mb-4">{step.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {step.tools.map((tool, toolIndex) => (
                    <span 
                      key={toolIndex}
                      className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Results Section */}
        <div className={`text-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <div className="p-8 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg border border-orange-500/30">
            <h3 className="text-2xl font-bold mb-4">Why This Works</h3>
            <div className="grid md:grid-cols-3 gap-8 mb-6">
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">87%</div>
                <div className="text-sm text-gray-400">Deploy successfully same day</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">92%</div>
                <div className="text-sm text-gray-400">Continue building after</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">3x</div>
                <div className="text-sm text-gray-400">Faster development cycles</div>
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              When you remove deployment friction and harness AI effectively, 
              building becomes addictive. Our graduates ship more in their first month 
              than they did in the previous year.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}