'use client'

import { useState } from 'react'

export default function WhatYouBuild() {
  const [selectedTool, setSelectedTool] = useState<string>('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const tools = [
    { id: 'v0', name: 'V0', description: 'Vercel Website + App Creator' },
    { id: 'lovable', name: 'Lovable', description: 'Build software via chat interface' },
    { id: 'replit', name: 'Replit', description: 'Safest place for vibe coding' },
  ]

  const features = [
    { id: 'forms', name: 'Capture & validate data', desc: 'Clean forms with validation' },
    { id: 'ai-summary', name: 'Summarize & label', desc: 'AI pulls key info' },
    { id: 'pricing', name: 'Score & decide', desc: 'Pricing/routing rules' },
    { id: 'crud', name: 'Manage records', desc: 'List, filter, edit' },
    { id: 'rag', name: 'Search knowledge', desc: 'RAG + citations' },
    { id: 'web-search', name: 'Search the web', desc: 'Grounded Q&A' },
    { id: 'tasks', name: 'Assign & complete', desc: 'Task queue system' },
    { id: 'status', name: 'Track status', desc: 'States + audit log' },
    { id: 'collab', name: 'Collaborate live', desc: 'Presence + activity' },
    { id: 'generate', name: 'Generate content', desc: 'AI images/text' },
    { id: 'docs', name: 'Generate docs', desc: 'Reports/emails' },
    { id: 'notify', name: 'Notify & remind', desc: 'Alerts/timers' },
  ]

  const outputs = [
    'Downloadable PDF',
    'Shareable public link',
    'Automatic email',
    'Spreadsheet export',
    'Calendar invites',
    'Short URL',
    'Slack/Discord community post',
    'Public dashboard',
    'Chart/PNG export',
  ]

  const examples = [
    {
      title: 'Waitlist Landing Page',
      description: 'Email capture + onboarding flow',
      difficulty: 'Easy',
      time: '2 hours'
    },
    {
      title: 'Internal Tool Dashboard',
      description: 'CRUD operations + basic charts',
      difficulty: 'Medium',
      time: '3 hours'
    },
    {
      title: 'AI Customer Support Bot',
      description: 'Knowledge base Q&A with citations',
      difficulty: 'Medium',
      time: '3 hours'
    },
    {
      title: 'Booking System',
      description: 'Calendar slots + confirmation emails',
      difficulty: 'Hard',
      time: '4 hours'
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What You'll Build
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Choose your tools, pick your features, ship your MVP. 
          We'll help you scope it right for a one-day build.
        </p>

        {/* Interactive Builder */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Tool Selection */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-orange-400">1. Pick Your Tool</h3>
            <div className="space-y-3">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full p-4 border rounded-lg text-left transition-all ${
                    selectedTool === tool.id
                      ? 'border-orange-500 bg-orange-950/30'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="font-semibold">{tool.name}</div>
                  <div className="text-sm text-gray-400">{tool.description}</div>
                </button>
              ))}
            </div>

            <h3 className="text-xl font-semibold text-orange-400 pt-6">2. Choose 2-3 Core Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {features.slice(0, 6).map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => {
                    if (selectedFeatures.includes(feature.id)) {
                      setSelectedFeatures(selectedFeatures.filter(f => f !== feature.id))
                    } else if (selectedFeatures.length < 3) {
                      setSelectedFeatures([...selectedFeatures, feature.id])
                    }
                  }}
                  className={`p-3 border rounded-lg text-left transition-all text-sm ${
                    selectedFeatures.includes(feature.id)
                      ? 'border-orange-500 bg-orange-950/30'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-xs text-gray-400">{feature.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:pl-8">
            <h3 className="text-xl font-semibold text-orange-400 mb-6">Your MVP Preview</h3>
            <div className="border border-gray-800 rounded-lg p-6 bg-gray-950/50">
              {selectedTool || selectedFeatures.length > 0 ? (
                <div className="space-y-4">
                  {selectedTool && (
                    <div>
                      <span className="text-sm text-gray-400">Tool:</span>
                      <p className="font-semibold">
                        {tools.find(t => t.id === selectedTool)?.name}
                      </p>
                    </div>
                  )}
                  {selectedFeatures.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-400">Features:</span>
                      <ul className="mt-2 space-y-1">
                        {selectedFeatures.map(id => {
                          const feature = features.find(f => f.id === id)
                          return (
                            <li key={id} className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span>{feature?.name}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400">Estimated build time:</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {selectedFeatures.length * 1.5 + 1} hours
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select a tool and features to see your MVP preview
                </p>
              )}
            </div>

            <h3 className="text-xl font-semibold text-orange-400 mt-8 mb-4">3. Outputs & Integrations</h3>
            <div className="flex flex-wrap gap-2">
              {outputs.map((output) => (
                <span
                  key={output}
                  className="px-3 py-1 border border-gray-700 rounded-full text-sm text-gray-300"
                >
                  {output}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Example Projects */}
        <div>
          <h3 className="text-2xl font-semibold text-center mb-8">Example Projects</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examples.map((example, i) => (
              <div
                key={i}
                className="p-6 border border-gray-800 rounded-lg hover:border-orange-500/50 transition-all card-hover"
              >
                <div className={`inline-block px-2 py-1 rounded text-xs mb-3 ${
                  example.difficulty === 'Easy' ? 'bg-green-900/50 text-green-300' :
                  example.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                  'bg-red-900/50 text-red-300'
                }`}>
                  {example.difficulty}
                </div>
                <h4 className="font-semibold mb-2">{example.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{example.description}</p>
                <p className="text-xs text-gray-500">⏱ {example.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}