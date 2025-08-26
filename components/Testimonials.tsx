'use client'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Claude User → Deployed Builder',
      avatar: '👩‍💻',
      quote: 'I was generating perfect code with Claude but could never get it live. The vibe coding method changed everything. Deployed my first app in 6 hours.',
      project: 'Shipped: vibephx.com clone for her startup'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Cursor Power User',
      avatar: '👨‍💻',
      quote: 'Used Cursor for months but always got stuck on deployment. Now I ship every weekend. The workflow is addictive.',
      project: 'Shipped: AI-powered analytics dashboard'
    },
    {
      name: 'Alex Thompson',
      role: 'Tutorial Hell Survivor',
      avatar: '👨‍🎓',
      quote: 'Watched 100+ YouTube tutorials. Built 0 real apps. VibePHX broke the cycle. I\'m now a serial shipper.',
      project: 'Shipped: Real-time chat app with AI moderation'
    },
    {
      name: 'Jessica Park',
      role: 'Designer Who Ships',
      avatar: '👩‍🎨',
      quote: 'I design beautiful UIs but was terrified of deployment. Now I prototype AND ship. My design process is 10x faster.',
      project: 'Shipped: Portfolio site with CMS integration'
    },
    {
      name: 'David Kim',
      role: 'Weekend Warrior',
      avatar: '🧑‍💻',
      quote: 'Validated 3 SaaS ideas in 3 weekends using the vibe coding method. One is already making $500/month.',
      project: 'Shipped: Subscription management tool'
    },
    {
      name: 'Emma Wilson',
      role: 'AI-First Founder',
      avatar: '👩‍🚀',
      quote: 'Learned to debug AI-generated code and now I\'m unstoppable. Built and launched my startup\'s MVP in one weekend.',
      project: 'Shipped: B2B workflow automation platform'
    }
  ]

  const stats = [
    { number: '87%', label: 'Deploy successfully day 1' },
    { number: '92%', label: 'Ship again within 30 days' },
    { number: '4.9/5', label: 'Average workshop rating' },
    { number: '156+', label: 'Live apps and counting' }
  ]

  return (
    <section className="py-20 px-6 md:px-8 lg:px-12 bg-gradient-to-b from-gray-900/20 to-black">
      <div className="max-w-6xl mx-auto">
        {/* <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          From Localhost to Live Product
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Real builders, real deployments, real businesses
        </p>

        Stats
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div> */}

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="p-6 border border-gray-800 rounded-lg hover:border-orange-500/50 transition-all card-hover bg-gray-950/30"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
              <div className="text-sm text-orange-400 font-medium">
                {testimonial.project}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}