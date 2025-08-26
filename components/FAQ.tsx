'use client'

import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "I can't code at all. Is this really for me?",
      answer: "Absolutely! That's the whole point. We use AI tools that generate code from your descriptions. You'll be typing in plain English, not programming languages. Our mentors guide you through everything."
    },
    {
      question: "What if I don't finish in one day?",
      answer: "Everyone ships something by 5pm - we scope projects to ensure this. You might not have every feature, but you'll have a working MVP and a clear 30-day plan to continue building."
    },
    {
      question: "What should I build?",
      answer: "Bring any idea! Common projects include: landing pages with waitlists, internal tools for your job, simple SaaS MVPs, automation tools, or client portals. We help you scope it right during the morning session."
    },
    {
      question: "What do I need to bring?",
      answer: "Just your laptop and an idea. We provide the tools, templates, lunch, snacks, and all the guidance you need. Come with an open mind and ready to build!"
    },
    {
      question: "Is this just another course or bootcamp?",
      answer: "No! This is a hands-on building sprint. You're not watching videos or doing exercises - you're building YOUR actual product with peers and getting it live the same day."
    },
    {
      question: "What tools will we use?",
      answer: "We'll use AI builders like V0 (Vercel), Lovable, or Replit, plus no-code tools for databases, emails, and payments. Everything is browser-based - no complex software installation needed."
    },
    {
      question: "What happens after the workshop?",
      answer: "You leave with: a working MVP, the skills to keep building, a 30-day action plan, an accountability buddy, and access to our Phoenix builder community for ongoing support."
    },
    {
      question: "Can I get a refund?",
      answer: "Yes! If you attend the full day and don't leave with a working prototype, we'll refund you 100%. We're confident you'll ship, but we remove all risk for you."
    },
    {
      question: "Why only 20 people?",
      answer: "Small groups ensure everyone gets personal attention, meaningful connections form, and no one gets left behind. It's intimate by design - you're not lost in a crowd."
    },
    {
      question: "I'm not 20-35. Can I still come?",
      answer: "While we optimize for this age group's energy and style, we welcome builders of all ages who vibe with our fast-paced, hands-on approach. If you're ready to ship, you belong!"
    }
  ]

  return (
    <section id="faq" className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Common Questions
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Everything you need to know before joining
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-800 rounded-lg overflow-hidden hover:border-orange-500/50 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-950/50 transition-colors"
              >
                <span className="font-semibold pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-orange-400 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 p-6 border border-gray-800 rounded-lg text-center bg-gray-950/30">
          <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-4">
            Reach out and we'll get back to you within 24 hours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@vibephx.com"
              className="px-6 py-2 border border-gray-700 rounded-lg hover:border-orange-500 transition-colors"
            >
              hello@vibephx.com
            </a>
            <a
              href="https://discord.gg/Vmk3eFyj"
              className="px-6 py-2 border border-gray-700 rounded-lg hover:border-orange-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}