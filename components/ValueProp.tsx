'use client'

import { Link2Icon, GearIcon, TokensIcon, PersonIcon, BarChartIcon, CrossCircledIcon, LoopIcon, CounterClockwiseClockIcon } from '@radix-ui/react-icons'
import { useState, useRef, useEffect } from 'react'

export default function ValueProp() {
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

  return (
    <section ref={sectionRef} id="valueprop" className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className={isVisible ? 'animate-fade-in' : ''} style={{ animationDelay: '0s' }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What you'll get for <span className="text-gradient">$99</span>
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to ship your first AI-built app
            </p>
          </div>
        </div>

        {/* What You Get */}
        <div className={isVisible ? 'animate-slide-up' : ''} style={{ animationDelay: '0.2s' }}>
          <div className="bg-gray-950/50 border border-gray-800 rounded-lg p-8 mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={isVisible ? 'animate-fade-in' : ''} style={{ animationDelay: '0.4s' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Link2Icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Working URL or deploy-ready pipeline by 5pm</div>
                    <div className="text-sm text-gray-400">Measurable success criteria</div>
                  </div>
                </div>
              </div>
              <div className={isVisible ? 'animate-fade-in' : ''} style={{ animationDelay: '0.5s' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GearIcon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold">The workflow</div>
                    <div className="text-sm text-gray-400">PRD template, constraint prompts, short loops</div>
                  </div>
                </div>
              </div>
              <div className={isVisible ? 'animate-fade-in' : ''} style={{ animationDelay: '0.6s' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TokensIcon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Cost controls</div>
                    <div className="text-sm text-gray-400">Token budgets, model switching, context tactics</div>
                  </div>
                </div>
              </div>
              <div className={isVisible ? 'animate-fade-in' : ''} style={{ animationDelay: '0.7s' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PersonIcon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Community</div>
                    <div className="text-sm text-gray-400">Accountability partner + PHX builders</div>
                  </div>
                </div>
              </div>
              <div className={isVisible ? 'animate-fade-in' : ''} style={{ animationDelay: '0.8s' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChartIcon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold">30-day playbook</div>
                    <div className="text-sm text-gray-400">Next features, metrics</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={isVisible ? 'animate-fade-in' : ''} style={{ animationDelay: '0.9s' }}>
              <div className="mt-8 p-4 bg-green-950/20 border border-green-800/30 rounded-lg text-center">
                <p className="text-green-400 font-semibold">
                  If you don't reach a working URL or deploy-ready pipeline, you join the next cohort free.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pain Point Solutions */}
        <div className={isVisible ? 'animate-slide-up' : ''} style={{ animationDelay: '1s' }}>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">We solve the problems that keep you stuck</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className={isVisible ? 'animate-slide-up' : ''} style={{ animationDelay: '1.1s' }}>
                <div className="p-6 bg-red-950/20 border border-red-800/30 rounded-lg text-center">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CrossCircledIcon className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="text-red-400 font-semibold mb-2">"I can't deploy"</div>
                  <div className="text-sm text-gray-400">We wire hosting first. Your first commit creates a live preview and shareable URL.</div>
                </div>
              </div>
              <div className={isVisible ? 'animate-slide-up' : ''} style={{ animationDelay: '1.2s' }}>
                <div className="p-6 bg-yellow-950/20 border border-yellow-800/30 rounded-lg text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <LoopIcon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="text-yellow-400 font-semibold mb-2">"AI keeps drifting"</div>
                  <div className="text-sm text-gray-400">PRD template + 'don't' rules keep Claude/Copilot on rails and focused.</div>
                </div>
              </div>
              <div className={isVisible ? 'animate-slide-up' : ''} style={{ animationDelay: '1.3s' }}>
                <div className="p-6 bg-orange-950/20 border border-orange-800/30 rounded-lg text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CounterClockwiseClockIcon className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="text-orange-400 font-semibold mb-2">"Burning $$ on prompts"</div>
                  <div className="text-sm text-gray-400">Token budgets + context strategies + model switching cuts waste by 60%.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}