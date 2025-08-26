'use client'

export default function Instructor() {
  const stats = [
    { number: '47+', label: 'AI Apps Deployed' },
    { number: '2+', label: 'Years Vibe Coding' },
    { number: '142+', label: 'Builders Trained' },
    { number: '87%', label: 'Same-Day Success Rate' },
  ]

  const companies = [
    { name: 'VibePHX', description: 'AI Builder Community (this site!)', icon: '🚀' },
    { name: 'FlowState', description: 'AI-Powered Productivity Suite', icon: '⚡' },
    { name: 'DevTracker', description: 'Real-time Development Analytics', icon: '📊' },
  ]

  const featured = [
    { platform: 'Microsoft Learn', icon: '🎯' },
    { platform: 'Replit Community', icon: '🚀' },
    { platform: 'OpenAI Cookbook', icon: '🤖' },
  ]

  return (
    <section className="py-20 px-6 md:px-8 lg:px-12 bg-gradient-to-b from-black to-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left side - Photo and stats */}
          <div className="flex flex-col items-center lg:items-start space-y-16">
            <div className="relative">
              {/* Photo with gradient border */}
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl rotate-3"></div>
                <div className="relative bg-gray-800 rounded-3xl overflow-hidden">
                  <img 
                    src="/cody-photo.png" 
                    alt="Cody Robertson"
                    className="w-full h-full object-cover filter grayscale"
                    onError={(e) => {
                      // Fallback to placeholder if image doesn't load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <div className="text-6xl">👨‍💻</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 w-full max-w-xs">
              {stats.map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-xs text-gray-400 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Hi, I'm Cody Robertson.
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              I've been obsessed with AI-assisted development since GPT-3. I've built and deployed 
              dozens of products using Claude, Cursor, and the vibe coding methodology. 
              My mission: help you break through from localhost to live product.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-400">Built with AI:</h3>
              <div className="grid gap-4">
                {companies.map((company, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-4 p-4 border border-gray-800 rounded-lg hover:border-orange-500/50 transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{company.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{company.name}</div>
                      <div className="text-sm text-gray-400">{company.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <div className="flex items-center gap-6 flex-wrap">
                <span className="text-sm text-gray-400">Methodology featured in:</span>
                {featured.map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.platform}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-4 pt-4">
              <a 
                href="https://twitter.com/mackody_" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-gray-800 rounded-lg hover:border-orange-500 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/codyrobertson" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-gray-800 rounded-lg hover:border-orange-500 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}