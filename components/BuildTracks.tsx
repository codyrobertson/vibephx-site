'use client'

import { useState, useEffect, useRef } from 'react'

export default function BuildTracks() {
  const [selectedTrack, setSelectedTrack] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const tracks = [
    {
      title: 'Case-Study Scraper → Publisher',
      hook: 'Turn any public webpage into a branded case study in minutes.',
      description: 'Paste URL → extract key points → auto-summarize → export PDF + shareable URL.',
      icon: '📊',
      persona: 'Content marketers, agencies, growth teams',
      tech: [
        { name: 'v0.dev', logo: 'v0.dev' },
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'Claude API', logo: 'anthropic.com' },
        { name: 'Supabase', logo: 'supabase.com' }
      ],
      difficulty: 'Beginner-friendly',
      shipsToday: ['Live scraper URL', 'PDF export', 'Shareable case studies', 'Mobile responsive']
    },
    {
      title: 'CRM-Connected Booking',
      hook: 'One booking link that writes to your CRM.',
      description: 'Public booking page → confirm email → write contact + meeting to CRM.',
      icon: '📅',
      persona: 'Consultants, local services, solo agencies',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'HubSpot API', logo: 'hubspot.com' },
        { name: 'Resend', logo: 'resend.com' },
        { name: 'Supabase', logo: 'supabase.com' }
      ],
      difficulty: 'Intermediate',
      shipsToday: ['Booking page live', 'CRM integration', 'Email confirmations', 'Calendar sync']
    },
    {
      title: 'Lead Triage + Scoring Inbox',
      hook: 'Stop drowning—AI scores and routes inbound leads.',
      description: 'Upload CSV → LLM tags + scores → "Respond" button drafts reply.',
      icon: '🎯',
      persona: 'SMBs, freelancers, agencies',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'Claude API', logo: 'anthropic.com' },
        { name: 'Supabase', logo: 'supabase.com' },
        { name: 'Papa Parse', logo: 'papaparse.com' }
      ],
      difficulty: 'Intermediate',
      shipsToday: ['Lead scoring dashboard', 'AI draft replies', 'CSV import', 'Priority routing']
    },
    {
      title: 'Paste Profile → Personalize Email',
      hook: 'Drop LinkedIn text → get clean, on-brand outreach email.',
      description: 'Text box for target info + your value props → 3 email variants + CTAs.',
      icon: '✉️',
      persona: 'Biz dev, creators, sales teams',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'Claude API', logo: 'anthropic.com' },
        { name: 'Handlebars', logo: 'handlebarsjs.com' }
      ],
      difficulty: 'Beginner-friendly',
      shipsToday: ['Email generator', '3 tone variants', 'Copy-paste ready', 'Template library']
    },
    {
      title: 'Review Reply Studio',
      hook: 'AI drafts perfect replies for Google/Yelp reviews.',
      description: 'Paste reviews → suggested replies → approve → email batch.',
      icon: '⭐',
      persona: 'Restaurants, spas, home services',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'Claude API', logo: 'anthropic.com' },
        { name: 'Resend', logo: 'resend.com' },
        { name: 'Supabase', logo: 'supabase.com' }
      ],
      difficulty: 'Beginner-friendly',
      shipsToday: ['Bulk reply generator', 'Tone customization', 'Email batching', 'Brand voice']
    },
    {
      title: 'Data → Deck Report Builder',
      hook: 'Turn a CSV into a polished 5-slide deck.',
      description: 'Upload CSV → select template → auto charts + takeaways → export PDF.',
      icon: '📈',
      persona: 'Analysts, founders, consultants',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'Chart.js', logo: 'chartjs.org' },
        { name: 'Claude API', logo: 'anthropic.com' },
        { name: 'jsPDF', logo: 'github.com' }
      ],
      difficulty: 'Advanced',
      shipsToday: ['Auto chart generation', 'PDF export', 'Template themes', 'Data insights']
    },
    {
      title: 'Creator Collab Tracker',
      hook: 'Track pitches, collabs, deliverables—without Salesforce.',
      description: 'Deals kanban → contact notes → status updates → link tracking.',
      icon: '🤝',
      persona: 'Creators, micro-agencies',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'Supabase', logo: 'supabase.com' },
        { name: 'Short.io', logo: 'short.io' }
      ],
      difficulty: 'Intermediate',
      shipsToday: ['Kanban board', 'Contact CRM', 'Link tracking', 'Click analytics']
    },
    {
      title: 'FAQ to Chat Mini-Bot',
      hook: 'Drop your doc; get an embeddable Q&A widget.',
      description: 'Upload text/FAQ → embed script → answers cite chunks.',
      icon: '💬',
      persona: 'Course sellers, small SaaS, local biz',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'Supabase', logo: 'supabase.com' },
        { name: 'Claude API', logo: 'anthropic.com' },
        { name: 'React', logo: 'reactjs.org' }
      ],
      difficulty: 'Advanced',
      shipsToday: ['Embeddable widget', 'Document citations', 'Q&A interface', 'Analytics']
    },
    {
      title: 'Waitlist + Viral Referral',
      hook: 'Spin up a waitlist with unique codes and share rewards.',
      description: 'Email capture → unique referral link → counter + leaderboard.',
      icon: '🚀',
      persona: 'App launches, restaurants, events',
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
      title: 'Ops Auto-Docs',
      hook: 'Turn messy SOP bullets into clean, versioned runbooks.',
      description: 'Paste SOP notes → sectioned doc → share link + PDF export.',
      icon: '📋',
      persona: 'Agencies, ops teams, restaurants',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'Claude API', logo: 'anthropic.com' },
        { name: 'jsPDF', logo: 'github.com' },
        { name: 'Supabase', logo: 'supabase.com' }
      ],
      difficulty: 'Intermediate',
      shipsToday: ['Structured runbooks', 'PDF export', 'Shareable links', 'Version control']
    },
    {
      title: 'Small Biz Quote Builder',
      hook: 'Instant branded quotes from a form; email to customer.',
      description: 'Choose services → auto price calc → generate PDF → email/send link.',
      icon: '💰',
      persona: 'Contractors, freelancers',
      tech: [
        { name: 'Next.js', logo: 'nextjs.org' },
        { name: 'Vercel', logo: 'vercel.com' },
        { name: 'jsPDF', logo: 'github.com' },
        { name: 'Resend', logo: 'resend.com' },
        { name: 'Supabase', logo: 'supabase.com' }
      ],
      difficulty: 'Beginner-friendly',
      shipsToday: ['Quote generator', 'PDF quotes', 'Email delivery', 'Pricing calculator']
    }
  ]

  // Duplicate tracks for infinite scroll effect
  const infiniteTracks = [...tracks, ...tracks, ...tracks]

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollAmount = 0
    const trackWidth = 320 // Approximate width of each track card
    const gap = 24 // Gap between cards
    const cardTotalWidth = trackWidth + gap
    
    const scroll = () => {
      scrollAmount += 0.5
      if (scrollAmount >= cardTotalWidth * tracks.length) {
        scrollAmount = 0
      }
      scrollContainer.scrollLeft = scrollAmount
    }

    const interval = setInterval(scroll, 50)
    return () => clearInterval(interval)
  }, [tracks.length])

  return (
    <section id="projects" className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What you'll build <span className="text-gradient">(choose a track)</span>
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            Pick a proven template or bring your own idea—same workflow, same outcome.
          </p>
          <div className="text-sm text-gray-500">
            Each project includes: Working MVP • Live URL • Source code • Deployment pipeline
          </div>
        </div>

        {/* Infinite Scrolling Carousel */}
        <div className="mb-12">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden pb-4"
            style={{
              scrollBehavior: 'smooth',
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}
          >
            {infiniteTracks.map((track, index) => (
              <div
                key={`${track.title}-${index}`}
                className={`flex-shrink-0 w-80 p-6 border rounded-lg transition-all cursor-pointer ${
                  selectedTrack === (index % tracks.length)
                    ? 'border-orange-500 bg-orange-950/20' 
                    : 'border-gray-800 hover:border-orange-500/50'
                }`}
                onClick={() => setSelectedTrack(index % tracks.length)}
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
                  {track.tech.slice(0, 3).map((tech, techIndex) => (
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
                  {track.tech.length > 3 && (
                    <span className="text-xs text-gray-500">+{track.tech.length - 3} more</span>
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