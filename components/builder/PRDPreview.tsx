'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { downloadMarkdown, downloadJSON, copyToClipboard } from '@/lib/prd-utils'
import { PRDFormData } from '@/lib/prd-templates'
import { DownloadIcon, CopyIcon, CheckIcon } from '@radix-ui/react-icons'

interface PRDPreviewProps {
  prdContent: string
  formData: PRDFormData
  onBack: () => void
}

export default function PRDPreview({ prdContent, formData, onBack }: PRDPreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await copyToClipboard(prdContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleDownloadMarkdown = () => {
    const filename = `${formData.projectName.toLowerCase().replace(/\s+/g, '-')}-prd.md`
    downloadMarkdown(prdContent, filename)
  }

  const handleDownloadJSON = () => {
    const filename = `${formData.projectName.toLowerCase().replace(/\s+/g, '-')}-prd.json`
    downloadJSON(formData, filename)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Your PRD is Ready!</h2>
          <p className="text-gray-400 mt-1">
            Review your product requirements document and export it
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Edit PRD
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleCopy} variant="secondary">
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </>
          )}
        </Button>
        <Button onClick={handleDownloadMarkdown} variant="secondary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download Markdown
        </Button>
        <Button onClick={handleDownloadJSON} variant="secondary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download JSON
        </Button>
      </div>

      {/* Preview */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <p className="text-sm text-gray-400">
            Preview - Markdown formatting will be preserved when exported
          </p>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
            {prdContent}
          </pre>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">🎯 Next Steps</h3>
        <ul className="text-blue-200 space-y-2 text-sm">
          <li>• Share this PRD with your team or stakeholders</li>
          <li>• Use it as a reference when building your project</li>
          <li>• Update it as requirements evolve</li>
          <li>• Store it in your project repository for documentation</li>
        </ul>
      </div>

      {/* Start Building CTA */}
      <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-orange-300 mb-2">Ready to Build?</h3>
        <p className="text-orange-200 text-sm mb-4">
          Use the VibePHX AI Builder to generate your complete project blueprint including technical specs,
          database schemas, UI designs, and deployment guides.
        </p>
        <Button asChild>
          <a href="/builder/template">Go to AI Builder</a>
        </Button>
      </div>
    </div>
  )
}
