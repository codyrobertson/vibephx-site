'use client'

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Plus,
  RotateCw,
  Share,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from 'react'
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function HeroNew() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/background.webm" type="video/webm" />
      </video>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />

      <div className="relative z-10 h-screen flex flex-col justify-center px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Date Badge */}
          <div className={`inline-flex items-center px-4 py-2 mb-6 border border-orange-500/30 rounded-full bg-orange-500/10 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <Sparkles className="size-4 fill-orange-400 text-orange-400 mr-2" />
            <span className="text-orange-400 font-semibold">Oct 4, 2025</span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-gray-300">Phoenix, AZ</span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-gray-300">9AM - 5PM</span>
          </div>

          <h1 className={`text-4xl md:text-6xl font-bold tracking-tight mb-4 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            <span className="text-white">Ship a live,</span>
            <br />
            <span className="relative inline-block text-gradient overflow-hidden">
              AI-built app in one day.
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-slow"></div>
            </span>
          </h1>
          
          <p className={`text-gray-300 mb-4 max-w-2xl mx-auto tracking-tight text-lg ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
            Bring an idea. Leave with a working URL, a repeatable AI build workflow, and guardrails you can trust.
          </p>

          {/* Trust Row */}
          <div className={`mb-6 ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="text-sm text-gray-300 font-semibold">
              10+ yrs shipping to 100K+ users • 156+ apps shipped • 87% same-day deploy rate
            </div>
          </div>

          {/* Mentor Card */}
          <div className={`max-w-2xl mx-auto mb-6 p-4 bg-gray-950/50 border border-gray-800 rounded-lg ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center gap-4">
              <img 
                src="/cody-photo.png" 
                alt="Cody Robertson" 
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-semibold text-white text-sm">Cody Robertson</div>
                  <span className="px-2 py-0.5 bg-orange-500 text-black text-xs font-bold rounded-full">
                    YOUR MENTOR
                  </span>
                </div>
                <div className="text-xs text-gray-400">10+ years shipping products to 100K+ users • 47+ AI-assisted apps shipped • 142+ builders trained • 87% same-day success</div>
              </div>
            </div>
          </div>

          {/* Result Preview */}
          <div className={`text-center ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-semibold text-white mb-2">Result:</h3>
            <p className="text-gray-300 mb-8">You leave with a public URL in your name and the exact steps to repeat it.</p>
            
            {/* Before/After Browser Mockup */}
            <div className="relative flex flex-col gap-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-300">BEFORE</span>
                </div>
                <div className="w-8 h-px bg-gradient-to-r from-orange-500 to-red-500"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-300">AFTER</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <BrowserMockup
                  className="w-full"
                  url="cursor.com/claude-chat"
                  title="Code Chat"
                  showCode={true}
                />
                <BrowserMockup
                  className="w-full"
                  url="myapp.com/dashboard"
                  title="Live Dashboard"
                  showCode={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Scrim to clip mockup */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20" />
      </div>

      {/* CTA Section - Outside Hero */}
      <div className="relative bg-black py-12">
        <div className={`text-center ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <a 
            href="https://luma.com/cvlfi81t"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-bold text-lg hover:scale-105 transition-transform group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-300 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10">Reserve Your Spot — $99</span>
          </a>
          
          <div className="mt-3 text-xs text-gray-500">
            <span className="text-gray-400">Inspired by best practices from </span>
            <span className="text-gray-300 font-semibold">Replit, Microsoft Learn, and v0</span>
            <span className="text-gray-500"> (no affiliation)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const BrowserMockup = ({
  className = "",
  url = "localhost:3000/dashboard",
  title = "",
  showCode = true
}) => (
  <div className={cn("rounded-2xl relative w-full overflow-hidden border border-gray-700 bg-gray-900", className)}>
    <div className="bg-gray-800 flex items-center justify-between gap-10 px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-full bg-red-500" />
        <div className="size-3 rounded-full bg-yellow-500" />
        <div className="size-3 rounded-full bg-green-500" />
        <div className="ml-4 hidden items-center gap-2 opacity-40 lg:flex">
          <ChevronLeft className="size-4" />
          <ChevronRight className="size-4" />
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <p className="bg-gray-700 relative hidden w-full max-w-md rounded-full px-4 py-1 text-center text-sm tracking-tight text-gray-300 md:block">
          {url}
          <RotateCw className="absolute right-3 top-2 size-3.5" />
        </p>
      </div>

      <div className="flex items-center gap-4 opacity-40">
        <Share className="size-4 text-gray-400" />
        <Plus className="size-4 text-gray-400" />
        <Copy className="size-4 text-gray-400" />
      </div>
    </div>

    <div className="relative w-full bg-black p-3 h-96 overflow-hidden">
      {showCode ? (
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-400 font-semibold text-sm">Claude Chat</span>
          </div>
          
          <div className="space-y-3 text-gray-300 leading-snug overflow-hidden">
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-gray-500 text-xs mb-1">You:</div>
              <div className="text-sm">Build me a lead scoring dashboard</div>
            </div>
            
            <div className="bg-blue-900/20 p-2 rounded">
              <div className="text-blue-400 text-xs mb-1">Claude:</div>
              <pre className="text-xs text-gray-300">
{`I'll help you build a lead scoring dashboard.

First, let me create the API route:

// app/api/leads/route.ts
export async function POST(req: Request) {
  const lead = await req.json()
  
  // AI scoring logic
  const score = await openai.chat.completions
    .create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: \`Score this lead 1-10: \${lead}\`
      }]
    })
  
  return Response.json({ 
    score: score.choices[0].content 
  })
}`}
              </pre>
            </div>
            
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-gray-500 text-xs mb-1">You:</div>
              <div className="text-sm">Now add the dashboard UI</div>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              Chatting
            </span>
            <span>No live URL yet...</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4 h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 font-bold text-lg">Lead Dashboard</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-semibold text-sm">LIVE</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg border">
                <div className="text-blue-600 font-semibold text-lg">127</div>
                <div className="text-gray-600 text-sm">Total Leads</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border">
                <div className="text-green-600 font-semibold text-lg">8.4</div>
                <div className="text-gray-600 text-sm">Avg Score</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border">
                <div className="text-orange-600 font-semibold text-lg">23</div>
                <div className="text-gray-600 text-sm">High Priority</div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h4 className="font-semibold text-gray-900 text-sm">Recent Leads</h4>
              </div>
              <div className="divide-y">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Sarah Chen</div>
                    <div className="text-gray-500 text-xs">Enterprise inquiry</div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">9.2</div>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Mike Rodriguez</div>
                    <div className="text-gray-500 text-xs">Pricing question</div>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">7.1</div>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Alex Thompson</div>
                    <div className="text-gray-500 text-xs">Demo request</div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">8.7</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              Live at myapp.com
            </span>
            <span>$2,340 revenue</span>
          </div>
        </div>
      )}
    </div>
    
    <div className="bg-gray-800 absolute bottom-0 z-10 flex w-full items-center justify-center py-2 md:hidden">
      <p className="relative flex items-center gap-2 rounded-full px-4 py-1 text-center text-sm tracking-tight text-gray-300">
        {url}
      </p>
    </div>
  </div>
);