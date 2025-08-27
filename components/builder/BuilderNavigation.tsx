'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons'

interface BuilderNavigationProps {
  currentStep: 'template' | 'stack' | 'generate'
  canProceed?: boolean
  onNext?: () => void
  onPrevious?: () => void
  nextLabel?: string
  previousLabel?: string
}

export default function BuilderNavigation({ 
  currentStep, 
  canProceed = true, 
  onNext, 
  onPrevious,
  nextLabel = 'Next',
  previousLabel = 'Previous'
}: BuilderNavigationProps) {
  const router = useRouter()

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    } else {
      // Default navigation behavior
      switch (currentStep) {
        case 'stack':
          router.push('/builder/template')
          break
        case 'generate':
          router.push('/builder/stack')
          break
        default:
          router.push('/builder')
          break
      }
    }
  }

  const handleNext = () => {
    if (onNext) {
      onNext()
    } else {
      // Default navigation behavior
      switch (currentStep) {
        case 'template':
          // This should be handled by the page component
          break
        case 'stack':
          router.push('/builder/generate')
          break
        default:
          break
      }
    }
  }

  const showPrevious = currentStep !== 'template'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center">
          {showPrevious ? (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-colors text-sm md:text-base"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {previousLabel}
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors text-sm md:text-base"
          >
            {nextLabel}
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}