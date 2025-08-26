'use client'

export default function Schedule() {
  const schedule = [
    { 
      time: '9:00 AM', 
      title: 'Accounts + repo + Vercel wired', 
      description: 'Deploy first - every change goes live automatically',
      image: '/schedule/raman-0TlRMRsj-3I-unsplash.jpg',
      imageAlt: 'Builders setting up deployment pipeline with coffee'
    },
    { 
      time: '9:30 AM', 
      title: 'Workflow 101', 
      description: 'PRD → constraints → short loops',
      image: '/schedule/andrej-lisakov-2ZcAKI_p2nQ-unsplash.jpg',
      imageAlt: 'Team learning structured AI workflow methodology'
    },
    { 
      time: '10:00 AM', 
      title: 'Tools: Cursor/Claude + v0.app', 
      description: 'Build your personal AI stack (or Copilot)',
      image: '/schedule/paul-esch-laurent-6MeMUw5KDss-unsplash.jpg',
      imageAlt: 'MacBook with developer stickers showing AI coding tools'
    },
    { 
      time: '10:30 AM', 
      title: 'Sprint 1: scaffold + core flow', 
      description: 'Live preview from first commit',
      image: '/schedule/fahim-muntashir-14JOIxmsOqA-unsplash.jpg',
      imageAlt: 'Builder coding core application flow'
    },
    { 
      time: '12:00 PM', 
      title: 'Lunch & Debug clinic', 
      description: 'Show progress, debug together, refuel',
      image: '/schedule/marc-mintel-70dtB7MkdRI-unsplash.jpg',
      imageAlt: 'Healthy meal with coding setup for collaborative debugging'
    },
    { 
      time: '1:00 PM', 
      title: 'Sprint 2: features, env vars, error handling', 
      description: 'Polish for production readiness',
      image: '/schedule/boitumelo-v7xiSfj6mGI-unsplash.jpg',
      imageAlt: 'Focused builder working on production features'
    },
    { 
      time: '3:00 PM', 
      title: 'Lightweight user testing', 
      description: 'Share your link, get real feedback',
      image: '/schedule/piyush-agarwal-ubry7upCBn0-unsplash.jpg',
      imageAlt: 'Builder testing app with real users'
    },
    { 
      time: '3:30 PM', 
      title: 'Production deploy or pipeline handoff', 
      description: 'Go live or get deployment-ready',
      image: '/schedule/fahim-muntashir-pAgCpLoYXdQ-unsplash.jpg',
      imageAlt: 'Deployment interface showing successful production push'
    },
    { 
      time: '4:30 PM', 
      title: 'Docs + next-steps plan', 
      description: 'Your roadmap for continued building',
      image: '/schedule/van-tay-media--S2-AKdWQoQ-unsplash.jpg',
      imageAlt: 'Documentation and planning for future development'
    },
    { 
      time: '5:00 PM', 
      title: 'Demo & Celebrate', 
      description: 'Show off your LIVE app! You did it!',
      image: '/schedule/alex-gagareen-wypW7sNzBHY-unsplash.jpg',
      imageAlt: 'Evening celebration with multiple screens showing successful deployments'
    },
  ]

  return (
    <section id="schedule" className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          The one-day plan
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Realistic scope so we can win
        </p>
        
        {/* Scope Callout */}
        <div className="bg-blue-950/20 border border-blue-800/30 rounded-lg p-6 mb-12 max-w-2xl mx-auto">
          <h3 className="font-semibold text-blue-400 mb-3">What we'll build</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              One complete app with 2-3 pages
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              Database for storing your data
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              Real functionality that actually works
            </li>
          </ul>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-orange-500 to-red-500" />

          {/* Timeline items */}
          <div className="space-y-8">
            {schedule.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div
                    className={`overflow-hidden border border-gray-800 rounded-lg hover:border-orange-500/50 transition-all bg-gray-950/30`}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          // Fallback to gradient background if image doesn't load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                        <div className="text-4xl opacity-50">📸</div>
                      </div>
                      {/* Time overlay */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 rounded-full">
                        <span className="text-orange-400 font-bold text-sm">{item.time}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`p-6 ${
                      index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                    }`}>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-black" />

                {/* Empty space for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        {/* Key highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-gray-800 rounded-lg">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-semibold mb-2">Deployment-First</h3>
            <p className="text-sm text-gray-400">Deploy early, deploy often</p>
          </div>
          <div className="text-center p-6 border border-gray-800 rounded-lg">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-400">Let AI handle the code, you handle the vision</p>
          </div>
          <div className="text-center p-6 border border-gray-800 rounded-lg">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-semibold mb-2">Ship Guaranteed</h3>
            <p className="text-sm text-gray-400">Live app with real URL by 5pm</p>
          </div>
        </div>
      </div>
    </section>
  )
}