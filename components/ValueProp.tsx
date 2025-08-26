'use client'

export default function ValueProp() {
  return (
    <section id="valueprop" className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Social Proof Stats */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the builders who stopped talking and started deploying
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
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

        {/* What You Get */}
        <div className="bg-gray-950/50 border border-gray-800 rounded-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">What you'll get for $99</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <div className="font-semibold">Working URL or deploy-ready pipeline by 5pm</div>
                <div className="text-sm text-gray-400">Measurable success criteria</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <div className="font-semibold">The workflow</div>
                <div className="text-sm text-gray-400">PRD template, constraint prompts, short loops</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <div className="font-semibold">Cost controls</div>
                <div className="text-sm text-gray-400">Token budgets, model switching, context tactics</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <div className="font-semibold">Community</div>
                <div className="text-sm text-gray-400">Accountability partner + PHX builders</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <div className="font-semibold">30-day playbook</div>
                <div className="text-sm text-gray-400">Next features, metrics</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-green-950/20 border border-green-800/30 rounded-lg text-center">
            <p className="text-green-400 font-semibold">
              If you don't reach a working URL or deploy-ready pipeline, you join the next cohort free.
            </p>
          </div>
        </div>

        {/* Pain Point Solutions */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">We solve the problems that keep you stuck</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-red-950/20 border border-red-800/30 rounded-lg text-center">
              <div className="text-4xl mb-4">🚫</div>
              <div className="text-red-400 font-semibold mb-2">"I can't deploy"</div>
              <div className="text-sm text-gray-400">We wire hosting first. Your first commit creates a live preview and shareable URL.</div>
            </div>
            <div className="p-6 bg-yellow-950/20 border border-yellow-800/30 rounded-lg text-center">
              <div className="text-4xl mb-4">🌀</div>
              <div className="text-yellow-400 font-semibold mb-2">"AI keeps drifting"</div>
              <div className="text-sm text-gray-400">PRD template + 'don't' rules keep Claude/Copilot on rails and focused.</div>
            </div>
            <div className="p-6 bg-orange-950/20 border border-orange-800/30 rounded-lg text-center">
              <div className="text-4xl mb-4">💸</div>
              <div className="text-orange-400 font-semibold mb-2">"Burning $$ on prompts"</div>
              <div className="text-sm text-gray-400">Token budgets + context strategies + model switching cuts waste by 60%.</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}