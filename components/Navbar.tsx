'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MagicWandIcon } from '@radix-ui/react-icons'
import { useBuilder } from './builder/BuilderContext'

export default function Navbar() {
  const pathname = usePathname()
  const isBuilderPage = pathname === '/builder'
  
  let builderProgress = null
  try {
    const builder = useBuilder()
    builderProgress = builder.progress
  } catch {
    // Not in builder context, ignore
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left - Logo/Brand */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-orange-400">Vibe</span>
              <span className="text-white">PHX</span>
            </Link>

            {/* Center - Builder Title (only on builder page) */}
            {isBuilderPage && (
              <div className="flex items-center gap-2">
                <MagicWandIcon className="w-5 h-5 text-blue-400" />
                <span className="text-lg font-semibold">AI Project Builder</span>
                {builderProgress && (
                  <span className="hidden sm:block text-sm text-gray-400 ml-2">
                    Step {builderProgress.currentStep + 1}/{builderProgress.totalSteps}
                  </span>
                )}
              </div>
            )}

            {/* Right - Navigation Links */}
            <div className="flex items-center gap-4">
              {!isBuilderPage && (
                <Link 
                  href="/builder"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors"
                >
                  Try Builder
                </Link>
              )}
              {isBuilderPage && (
                <Link 
                  href="/"
                  className="px-4 py-2 border border-gray-600 hover:border-gray-400 text-white rounded-lg transition-colors"
                >
                  Back to VibePHX
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar Footer - Only on builder page */}
      {isBuilderPage && builderProgress && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-gray-800">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{builderProgress.stepTitle || `Step ${builderProgress.currentStep + 1}`}</span>
              <span>{Math.round(((builderProgress.currentStep + 1) / builderProgress.totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${((builderProgress.currentStep + 1) / builderProgress.totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}