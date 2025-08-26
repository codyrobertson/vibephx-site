'use client'

import { useEffect, useRef, useState } from 'react'

export default function Features() {
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

  const problemsWithTweets = [
    {
      icon: '🚫',
      title: 'Claude/Cursor but Can\'t Deploy',
      description: "You've got AI tools but hit a wall going from code to live app",
      tweet: {
        name: '@devstruggles',
        handle: 'AI Builder',
        content: "I can make Claude write beautiful code all day long... but getting it live? That's where I'm completely lost. 3 months of building, 0 apps deployed 😤",
        likes: '4.2K',
        retweets: '312'
      }
    },
    {
      icon: '🔄',
      title: 'Tutorial Hell Strikes Again',
      description: "Following tutorials perfectly, but can't build your own ideas",
      tweet: {
        name: '@stuck_dev',
        handle: 'Aspiring Founder',
        content: "Finished 47 tutorials on AI coding. Can follow along perfectly. Try to build my own app? Brain.exe has stopped working.",
        likes: '6.8K',
        retweets: '523'
      }
    },
    {
      icon: '🐛',
      title: 'AI Writes Buggy Code',
      description: "Your AI-generated code breaks and you don't know how to fix it",
      tweet: {
        name: '@frustrateddeveloper',
        handle: 'Builder',
        content: "Claude: 'Here's your code!' Me: *runs it* Console: 🔴🔴🔴🔴🔴 Me: 'Claude, fix this' Claude: *makes it worse* 🤡",
        likes: '9.1K',
        retweets: '892'
      }
    }
  ]

  const solutionsWithTweets = [
    {
      icon: '🚀',
      title: 'Deploy to Production TODAY',
      description: 'Learn the exact deployment workflow that works every time',
      tweet: {
        name: '@shippingfast',
        handle: 'VibePHX Graduate',
        content: "After months on localhost, my project went live in the workshop. The deploy-first method just clicked. 🎯",
        likes: '7.3K',
        retweets: '892'
      }
    },
    {
      icon: '🎯',
      title: 'AI Workflow Mastery',
      description: 'Build a repeatable system for turning ideas into apps',
      tweet: {
        name: '@buildwithsystem',
        handle: 'Indie Builder',
        content: "The PRD + prompt rules stopped AI from going off the rails. I shipped, then shipped again.",
        likes: '5.2K',
        retweets: '423'
      }
    },
    {
      icon: '🔧',
      title: 'Debug Like a Pro',
      description: 'Know when AI is wrong and how to fix it fast',
      tweet: {
        name: '@debugmaster',
        handle: 'Builder',
        content: "Finally understand when Claude is hallucinating vs actually helping. The debugging patterns saved me HOURS of frustration.",
        likes: '3.8K',
        retweets: '267'
      }
    }
  ]

  const benefits = [
    {
      icon: '✅',
      title: 'Your MVP',
      description: 'Working prototype same day',
      highlight: true
    },
    {
      icon: '✅',
      title: 'Validation',
      description: 'Real peer & user feedback'
    },
    {
      icon: '✅',
      title: 'AI & No-Code Skills',
      description: 'Hands-on tool training'
    },
    {
      icon: '✅',
      title: '30-Day Playbook',
      description: 'Clear next steps'
    },
    {
      icon: '✅',
      title: 'Community',
      description: 'Accountability buddy + founder network'
    }
  ]

  return (
    <section ref={sectionRef} className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Social Proof Section - Moved to top */}
        <div className={`mb-20 text-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <p className="text-gray-400 mb-6">Join Phoenix's AI-powered builder movement</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex -space-x-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-2 border-black flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-semibold">+142 builders</span>
              <span className="text-gray-400">shipped real apps with AI</span>
            </div>
          </div>
        </div>
        
        {/* Problem Section */}
        <div className={`mb-20 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-red-400">The Problem</span>
          </h2>
          <p className="text-center text-gray-400 mb-12">You're stuck in the "almost builder" zone</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {problemsWithTweets.map((problem, i) => (
              <div 
                key={i} 
                className="border border-red-900/30 rounded-lg bg-red-950/20 hover:border-red-700/50 transition-all"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Main card content */}
                <div className="p-6">
                  <div className="text-4xl mb-4">{problem.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-red-300">{problem.title}</h3>
                  <p className="text-gray-400 mb-6">{problem.description}</p>
                </div>
                
                {/* Tweet inside the card */}
                <div className="p-4 bg-black/30 border-t border-red-900/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-sm">{problem.tweet.name}</div>
                      <div className="text-xs text-gray-500">{problem.tweet.handle}</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{problem.tweet.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {problem.tweet.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      {problem.tweet.retweets}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solution Section */}
        <div className={`mb-20 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-green-400">The Solution</span>
          </h2>
          <p className="text-center text-gray-400 mb-12">Master the vibe coding workflow</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {solutionsWithTweets.map((solution, i) => (
              <div 
                key={i} 
                className="border border-green-900/30 rounded-lg bg-green-950/20 hover:border-green-700/50 transition-all card-hover"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                {/* Main card content */}
                <div className="p-6">
                  <div className="text-4xl mb-4">{solution.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-green-300">{solution.title}</h3>
                  <p className="text-gray-400 mb-6">{solution.description}</p>
                </div>
                
                {/* Tweet inside the card */}
                <div className="p-4 bg-black/30 border-t border-green-900/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-sm">{solution.tweet.name}</div>
                      <div className="text-xs text-gray-500">{solution.tweet.handle}</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{solution.tweet.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {solution.tweet.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      {solution.tweet.retweets}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-gradient">$99 Gets You</span>
          </h2>
          <p className="text-center text-gray-400 mb-12">Everything you need to launch</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className={`p-6 border ${benefit.highlight ? 'border-orange-500/50 bg-orange-950/20' : 'border-gray-800'} rounded-lg hover:border-orange-500/50 transition-all`}
                style={{ animationDelay: `${0.7 + i * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{benefit.icon}</span>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}