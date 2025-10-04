'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { getCachedLogoUrl } from '@/lib/logoCache'
import { aiTools } from '@/lib/config/ai-tools'
import { uiFrameworks } from '@/lib/config/ui-frameworks'
import { hostingProviders } from '@/lib/config/hosting-providers'
import { databaseProviders } from '@/lib/config/database-providers'

const TOOL_CONFIGS = aiTools
const UI_FRAMEWORKS = uiFrameworks
const HOSTING_PROVIDERS = hostingProviders
const DATABASE_PROVIDERS = databaseProviders

export function ProvidersPhase() {
  const { dbChoice, setDbChoice, setPhase, addMessages, selectedStack, setSelectedStack } = usePRDStore()
  const [selectedTool, setSelectedTool] = useState<keyof typeof TOOL_CONFIGS>('v0')
  const [uiChoices, setUiChoices] = useState<string[]>(['V0'])
  const [hostingChoice, setHostingChoice] = useState<string>('Vercel')

  // Update recommendations when tool changes
  useEffect(() => {
    const config = TOOL_CONFIGS[selectedTool]
    if (config) {
      // Auto-select first recommended options
      setUiChoices(config.recommendedUI.slice(0, 1))
      setHostingChoice(config.recommendedHosting[0])
      if (config.recommendedDB[0] !== 'Any') {
        setDbChoice(config.recommendedDB[0])
      }
    }
  }, [selectedTool, setDbChoice])

  // Get filtered options based on selected tool
  const getAvailableUI = () => {
    const config = TOOL_CONFIGS[selectedTool]
    if (config.recommendedUI.includes('Any')) return UI_FRAMEWORKS
    return UI_FRAMEWORKS.filter(ui =>
      config.recommendedUI.some(rec => ui.label.includes(rec) || rec.includes(ui.label))
    )
  }

  const getAvailableHosting = () => {
    const config = TOOL_CONFIGS[selectedTool]
    if (config.recommendedHosting.includes('Any')) return HOSTING_PROVIDERS
    return HOSTING_PROVIDERS.filter(host =>
      config.recommendedHosting.some(rec => host.label.includes(rec) || rec.includes(host.label))
    )
  }

  const getAvailableDB = () => {
    const config = TOOL_CONFIGS[selectedTool]
    if (config.recommendedDB.includes('Any')) return DATABASE_PROVIDERS
    return DATABASE_PROVIDERS.filter(db =>
      config.recommendedDB.some(rec => db.label.includes(rec) || rec.includes(db.label))
    )
  }

  const handleContinue = () => {
    setSelectedStack(`${TOOL_CONFIGS[selectedTool].name} • ${uiChoices.join(' + ')} • ${hostingChoice}`)

    addMessages([
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: `**My stack:**\n• Tool: ${TOOL_CONFIGS[selectedTool].name}\n• UI: ${uiChoices.join(' + ')}\n• Hosting: ${hostingChoice}\n• Database: ${dbChoice}`
      },
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Solid choice. **${TOOL_CONFIGS[selectedTool].name}** + **${hostingChoice}** + **${dbChoice}** will get you shipped fast.`
      }
    ])
    setPhase('integrations')
  }

  const availableUI = getAvailableUI()
  const availableHosting = getAvailableHosting()
  const availableDB = getAvailableDB()

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-800 bg-gray-900/50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-4">
        <div className="text-white font-semibold text-lg mb-1">Stack Selection</div>
        <div className="text-gray-400 text-sm">Pick your AI tool and stack</div>
      </div>
      <div className="space-y-6">
        {/* AI Tool Selection */}
        <div>
          <div className="text-white font-medium mb-2 text-sm">AI Coding Tool</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.keys(TOOL_CONFIGS) as Array<keyof typeof TOOL_CONFIGS>).map((toolId) => {
              const tool = TOOL_CONFIGS[toolId]
              return (
                <button
                  key={toolId}
                  onClick={() => setSelectedTool(toolId)}
                  className={`text-left p-3 rounded-xl border transition-colors ${
                    selectedTool === toolId
                      ? 'border-orange-500 bg-gray-900'
                      : 'border-gray-800 bg-gray-900/60 opacity-60 hover:opacity-100 hover:border-orange-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img src={getCachedLogoUrl(tool.logo, '24')} alt="" className="w-5 h-5 rounded-sm" />
                    <div className="text-white font-medium text-sm">{tool.name}</div>
                  </div>
                  <div className="text-xs text-gray-400">{tool.description}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* UI Framework (multi-select) */}
        <div>
          <div className="text-white font-medium mb-2 text-sm">
            UI Framework <span className="text-gray-500 text-xs">(multi-select)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {availableUI.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setUiChoices((prev) =>
                    prev.includes(opt.label)
                      ? prev.filter(x => x !== opt.label)
                      : [...prev, opt.label]
                  )
                }}
                className={`text-left p-3 rounded-xl border transition-colors flex items-center gap-2 ${
                  uiChoices.includes(opt.label)
                    ? 'border-orange-500 bg-gray-900'
                    : 'border-gray-800 bg-gray-900/60 opacity-60 hover:opacity-100 hover:border-orange-500'
                }`}
              >
                <img src={getCachedLogoUrl(opt.logo, '24')} alt="" className="w-5 h-5 rounded-sm" />
                <div className="text-white font-medium text-xs">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Hosting */}
        <div>
          <div className="text-white font-medium mb-2 text-sm">Hosting Platform</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableHosting.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setHostingChoice(opt.label)}
                className={`text-left p-3 rounded-xl border transition-colors ${
                  hostingChoice === opt.label
                    ? 'border-orange-500 bg-gray-900'
                    : 'border-gray-800 bg-gray-900/60 opacity-60 hover:opacity-100 hover:border-orange-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <img src={getCachedLogoUrl(opt.logo, '24')} alt="" className="w-5 h-5 rounded-sm" />
                  <div className="text-white font-medium text-xs">{opt.label}</div>
                </div>
                <div className="text-xs text-gray-400">{opt.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Database */}
        <div>
          <div className="text-white font-medium mb-2 text-sm">Database</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableDB.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDbChoice(opt.label)}
                className={`text-left p-3 rounded-xl border transition-colors ${
                  dbChoice === opt.label
                    ? 'border-orange-500 bg-gray-900'
                    : 'border-gray-800 bg-gray-900/60 opacity-60 hover:opacity-100 hover:border-orange-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <img src={getCachedLogoUrl(opt.logo, '24')} alt="" className="w-5 h-5 rounded-sm" />
                  <div className="text-white font-medium text-xs">{opt.label}</div>
                </div>
                <div className="text-xs text-gray-400">{opt.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleContinue} className="bg-orange-600 hover:bg-orange-500">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
