'use client'

import { useState, useRef, useEffect } from 'react'
import { GlobeIcon, TargetIcon, PersonIcon, BarChartIcon } from '@radix-ui/react-icons'

export default function CorePrinciples() {
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

  const principles = [
    {
      title: 'Deploy Early, Deploy Often',
      description: 'Your app should be live from commit #1',
      icon: GlobeIcon
    },
    {
      title: 'AI as Copilot, Not Autopilot', 
      description: 'You drive the vision, AI handles the implementation',
      icon: TargetIcon
    },
    {
      title: 'Real Users, Real Feedback',
      description: 'Build for actual people, not tutorial scenarios',
      icon: PersonIcon
    },
    {
      title: 'Progress Over Perfection',
      description: 'Ship working software, iterate based on usage',
      icon: BarChartIcon
    }
  ]

  return (
    <section ref={sectionRef} className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Core Principles
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            The systematic approach to AI-assisted development that actually ships
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className={`mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 border border-gray-800 rounded-lg hover:border-orange-500/50 transition-all"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <principle.icon className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">{principle.title}</h3>
                  <p className="text-gray-400">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof Stats */}
        <div className={`text-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <h3 className="text-2xl font-bold mb-8">
            Join the builders who stopped talking and started deploying
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">87%</div>
              <div className="text-gray-400">Deploy successfully same day</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">156+</div>
              <div className="text-gray-400">Live apps shipped</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">92%</div>
              <div className="text-gray-400">Continue building after</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}