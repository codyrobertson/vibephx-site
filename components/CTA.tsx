'use client'

import { useState } from 'react'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section className="py-20 px-6 md:px-8 lg:px-12 bg-gradient-to-r from-orange-600/20 to-red-600/20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Ready to Ship for Real?
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          September 13th could be the day everything changes.
        </p>

        {/* Main CTA */}
        <div className="mb-6">
          <button className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-bold text-xl hover:scale-105 transition-transform glow">
            Reserve My Spot → $99
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-8">
          💳 Secure payment • 🔒 100% refund if not satisfied • ✅ Instant confirmation
        </p>

        {/* Pricing Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-6">
          <div className="p-6 border border-gray-800 rounded-lg bg-gray-950/50">
            <h3 className="text-lg font-semibold mb-2">🎯 Solo Builder</h3>
            <p className="text-3xl font-bold text-orange-400 mb-2">$99</p>
            <p className="text-sm text-gray-400 mb-4">Full day + templates + community</p>
            <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors">
              Reserve Your Seat
            </button>
          </div>
          <div className="p-6 border border-orange-500 rounded-lg bg-orange-950/20 relative">
            <div className="absolute -top-3 left-4 px-3 py-1 bg-orange-500 text-black text-xs font-bold rounded-full">
              POPULAR
            </div>
            <h3 className="text-lg font-semibold mb-2">👥 2-Pack (Bring a Friend)</h3>
            <p className="text-3xl font-bold text-orange-400 mb-2">$169 <span className="text-lg text-gray-400 line-through">$198</span></p>
            <p className="text-sm text-gray-400 mb-4">Save $29 + accountability partnership</p>
            <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-lg font-semibold transition-colors">
              Grab Both Spots
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-lg font-semibold text-orange-400 mb-1">Risk-free:</p>
          <p className="text-gray-300">Ship today or join the next cohort free.</p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Live deployment guaranteed</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Limited to 20 builders</span>
          </div>
        </div>
      </div>
    </section>
  )
}