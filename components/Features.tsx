'use client'

import { useEffect, useRef, useState } from 'react'
import { CrossCircledIcon, LoopIcon, ExclamationTriangleIcon, RocketIcon, TargetIcon, MixerHorizontalIcon, CheckIcon } from '@radix-ui/react-icons'

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
      icon: CrossCircledIcon,
      title: 'Claude/Cursor but Can\'t Deploy',
      description: "You've got AI tools but hit a wall going from code to live app",
      realTweet: 'https://x.com/JulianGoldieSEO/status/1899798247885217901',
      tweet: {
        name: '@JulianGoldieSEO',
        handle: 'AI Agents',
        content: "Even Claude… created a project overview but couldn't build or deploy.",
        likes: '2.1K',
        retweets: '147'
      }
    },
    {
      icon: LoopIcon,
      title: 'Tutorial Hell Strikes Again',
      description: "Following tutorials perfectly, but can't build your own ideas",
      realTweet: 'https://x.com/dailydotdev/status/1940442930118058357',
      tweet: {
        name: '@dailydotdev',
        handle: 'daily.dev',
        content: "Is vibe coding hell the new tutorial hell?",
        likes: '3.7K',
        retweets: '892'
      }
    },
    {
      icon: ExclamationTriangleIcon,
      title: 'AI Writes Buggy Code',
      description: "Your AI-generated code breaks and you don't know how to fix it",
      realTweet: 'https://x.com/TheZvi/status/1862145448871448925',
      tweet: {
        name: '@TheZvi',
        handle: 'Zvi Mowshowitz',
        content: "It memorized buggy code and kept using it to write new code!",
        likes: '4.8K',
        retweets: '512'
      }
    }
  ]

  const solutionsWithTweets = [
    {
      icon: RocketIcon,
      title: 'Deploy to Production TODAY',
      description: 'Learn the exact deployment workflow that works every time',
      realTweet: 'https://x.com/claytonlz/status/1923496587063591191',
      tweet: {
        name: '@claytonlz',
        handle: 'Clayton',
        content: "I am begging you to deploy whatever you have today.",
        likes: '8.4K',
        retweets: '1.2K'
      }
    },
    {
      icon: TargetIcon,
      title: 'AI Workflow Mastery',
      description: 'Build a repeatable system for turning ideas into apps',
      realTweet: 'https://x.com/Jacobsklug/status/1948736493457211849',
      tweet: {
        name: '@Jacobsklug',
        handle: 'Jacob',
        content: "Clear requirements on paper = 10× faster execution with AI.",
        likes: '3.2K',
        retweets: '423'
      }
    },
    {
      icon: MixerHorizontalIcon,
      title: 'Debug Like a Pro',
      description: 'Know when AI is wrong and how to fix it fast',
      realTweet: 'https://x.com/RayFernando1337/status/1958342445361672592',
      tweet: {
        name: '@RayFernando1337',
        handle: 'Ray Fernando',
        content: "Cursor Bugbot… caught a bug during my PR after a massive refactor.",
        likes: '2.1K',
        retweets: '267'
      }
    }
  ]

  const benefits = [
    {
      icon: CheckIcon,
      title: 'Your MVP',
      description: 'Working prototype same day',
      highlight: true
    },
    {
      icon: CheckIcon,
      title: 'Validation',
      description: 'Real peer & user feedback'
    },
    {
      icon: CheckIcon,
      title: 'AI & No-Code Skills',
      description: 'Hands-on tool training'
    },
    {
      icon: CheckIcon,
      title: '30-Day Playbook',
      description: 'Clear next steps'
    },
    {
      icon: CheckIcon,
      title: 'Community',
      description: 'Accountability buddy + founder network'
    }
  ]

  return (
    <section ref={sectionRef} className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        
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
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                    <problem.icon className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-red-300">{problem.title}</h3>
                  <p className="text-gray-400 mb-6">{problem.description}</p>
                </div>
                
                {/* Tweet inside the card */}
                <a 
                  href={problem.realTweet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-black/30 border-t border-red-900/20 hover:bg-black/50 transition-colors"
                >
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
                </a>
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
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                    <solution.icon className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-green-300">{solution.title}</h3>
                  <p className="text-gray-400 mb-6">{solution.description}</p>
                </div>
                
                {/* Tweet inside the card */}
                <a 
                  href={solution.realTweet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-black/30 border-t border-green-900/20 hover:bg-black/50 transition-colors"
                >
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
                </a>
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
                  <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <benefit.icon className="w-4 h-4 text-green-400" />
                  </div>
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