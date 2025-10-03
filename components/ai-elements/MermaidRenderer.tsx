'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#000000',
    primaryColor: '#f97316',
    primaryTextColor: '#fff',
    primaryBorderColor: '#374151',
    lineColor: '#9ca3af',
    secondaryColor: '#1f2937',
    tertiaryColor: '#111827',
  },
})

export function MermaidRenderer({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const renderChart = async () => {
      if (!chart || !ref.current) return
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await mermaid.render(id, chart)
        setSvg(svg)
        setError('')
      } catch (err: any) {
        console.error('Mermaid render error:', err)
        setError(err.message || 'Failed to render diagram')
      }
    }
    renderChart()
  }, [chart])

  if (error) {
    return (
      <div className="my-3 p-3 bg-red-900/20 border border-red-800 rounded text-red-300 text-xs">
        Diagram error: {error}
      </div>
    )
  }

  return (
    <div 
      ref={ref} 
      className="my-4 p-4 bg-gray-950 border border-gray-800 rounded-lg overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

