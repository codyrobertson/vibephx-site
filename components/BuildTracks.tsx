'use client'

import { useState } from 'react'

export default function BuildTracks() {
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [filter, setFilter] = useState('all')

  const allTracks = [
    {
      title: 'AI Lead Scorer & Responder',
      hook: 'Stop drowning—AI scores and routes inbound leads.',
      description: 'Upload CSV → LLM tags + scores → "Respond" button drafts reply.',
      icon: '🎯',
      persona: 'SMBs, freelancers, agencies',
      category: 'productivity',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'Claude API', logo: 'anthropic.com' },
        { name: 'Supabase', logo: 'supabase.com' }
      ],
      difficulty: 'Beginner-friendly',
      shipsToday: ['Lead scoring dashboard', 'AI draft replies', 'CSV import', 'Priority routing']
    },
    {
      title: 'CRM-Connected Booking System',
      hook: 'One booking link that writes to your CRM.',
      description: 'Public booking page → confirm email → write contact + meeting to CRM.',
      icon: '📅',
      persona: 'Consultants, local services, solo agencies',
      category: 'business',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'HubSpot API', logo: 'hubspot.com' },
        { name: 'Supabase', logo: 'supabase.com' }
      ],
      difficulty: 'Intermediate',
      shipsToday: ['Booking page live', 'CRM integration', 'Email confirmations', 'Calendar sync']
    },
    {
      title: 'Viral Waitlist Builder',
      hook: 'Spin up a waitlist with unique codes and share rewards.',
      description: 'Email capture → unique referral link → counter + leaderboard.',
      icon: '🚀',
      persona: 'App launches, restaurants, events',
      category: 'marketing',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'Supabase', logo: 'supabase.com' },
        { name: 'Resend', logo: 'resend.com' }
      ],
      difficulty: 'Beginner-friendly',
      shipsToday: ['Referral system', 'Leaderboard', 'Email capture', 'Real-time counters']
    },
    {
      title: 'Smart Quote Generator',
      hook: 'Instant branded quotes from a form; email to customer.',
      description: 'Choose services → auto price calc → generate PDF → email/send link.',
      icon: '💰',
      persona: 'Contractors, freelancers, service providers',
      category: 'business',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'jsPDF', logo: 'github.com' },
        { name: 'Resend', logo: 'resend.com' }
      ],
      difficulty: 'Beginner-friendly',
      shipsToday: ['Quote generator', 'PDF quotes', 'Email delivery', 'Pricing calculator']
    }
  ]

  // Filter logic
  const filteredTracks = filter === 'all' 
    ? allTracks 
    : allTracks.filter(track => track.category === filter)
  
  const tracks = filteredTracks

  return (
    <section id="projects" className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What you'll build <span className="text-gradient">(4 proven tracks)</span>
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            Pick a proven template or bring your own idea—same workflow, same outcome.
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              { key: 'all', label: 'All Tracks', count: allTracks.length },
              { key: 'productivity', label: 'AI & Productivity', count: allTracks.filter(t => t.category === 'productivity').length },
              { key: 'business', label: 'Business Tools', count: allTracks.filter(t => t.category === 'business').length },
              { key: 'marketing', label: 'Marketing', count: allTracks.filter(t => t.category === 'marketing').length }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => {
                  setFilter(filterOption.key)
                  setSelectedTrack(0)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === filterOption.key
                    ? 'bg-orange-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-500">
            Each project includes: Working MVP • Live URL • Source code • Deployment pipeline
          </div>
        </div>

        {/* Track Grid */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tracks.map((track, index) => (
              <div
                key={track.title}
                className={`p-6 border rounded-lg transition-all cursor-pointer ${
                  selectedTrack === index
                    ? 'border-orange-500 bg-orange-950/20' 
                    : 'border-gray-800 hover:border-orange-500/50'
                }`}
                onClick={() => setSelectedTrack(index)}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{track.icon}</span>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    track.difficulty === 'Beginner-friendly' ? 'bg-green-900/30 text-green-400' :
                    track.difficulty === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {track.difficulty}
                  </div>
                </div>
                
                <h3 className="font-semibold mb-2 text-lg leading-tight">{track.title}</h3>
                <p className="text-orange-400 text-sm mb-3 font-medium">{track.hook}</p>
                <p className="text-gray-500 text-xs mb-3">{track.persona}</p>
                
                <div className="flex flex-wrap gap-2">
                  {track.tech.slice(0, 2).map((tech, techIndex) => (
                    <div key={techIndex} className="flex items-center gap-1">
                      <img 
                        src={`https://img.logo.dev/${tech.logo}?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=16`}
                        alt={tech.name}
                        className="w-4 h-4 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <span className="text-xs text-gray-400">{tech.name}</span>
                    </div>
                  ))}
                  {track.tech.length > 2 && (
                    <span className="text-xs text-gray-500">+{track.tech.length - 2} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Track Details */}
        <div className="bg-gray-950/50 border border-gray-800 rounded-lg p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <span className="text-3xl">{tracks[selectedTrack].icon}</span>
                {tracks[selectedTrack].title}
              </h3>
              <p className="text-orange-400 text-lg font-medium mb-4">{tracks[selectedTrack].hook}</p>
              <p className="text-gray-300 mb-4">{tracks[selectedTrack].description}</p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-orange-400 mb-3">Perfect for:</h4>
                <p className="text-gray-400 text-sm">{tracks[selectedTrack].persona}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-orange-400 mb-3">What ships today:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {tracks[selectedTrack].shipsToday.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-orange-400 mb-4">Tech stack you'll master:</h4>
              <div className="grid gap-3 mb-6">
                {tracks[selectedTrack].tech.map((tech, techIndex) => (
                  <div 
                    key={techIndex}
                    className="flex items-center gap-3 px-3 py-2 bg-gray-800/50 rounded-lg"
                  >
                    <img 
                      src={`https://img.logo.dev/${tech.logo}?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=24`}
                      alt={tech.name}
                      className="w-6 h-6 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <span className="text-sm font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Deploy-first setup (hosting ready from minute 1)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">AI-assisted development with guardrails</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Cost controls + token budget management</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Production-ready with error handling</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bring Your Own Idea */}
        <div className="mt-12 p-6 border border-gray-700 rounded-lg bg-gray-900/30 text-center">
          <h3 className="text-xl font-semibold mb-3">💡 Prefer your own idea?</h3>
          <p className="text-gray-400 mb-4">
            Bring any project idea—we'll apply the same vibe-coding workflow to get it live.
          </p>
          <div className="text-sm text-gray-500">
            Popular custom builds: Chrome extensions, Discord bots, data dashboards, API wrappers
          </div>
        </div>

      </div>
    </section>
  )
}