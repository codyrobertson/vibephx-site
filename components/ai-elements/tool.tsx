'use client'

import { cn } from '@/lib/utils'

interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, any>
  state: 'call' | 'result' | 'partial-call'
  result?: any
  error?: string
}

interface ToolProps extends React.HTMLAttributes<HTMLDivElement> {
  tool: ToolInvocation
}

export function Tool({ tool, className, ...props }: ToolProps) {
  const isComplete = tool.state === 'result'
  const hasError = 'error' in tool && tool.error

  return (
    <div
      className={cn(
        'rounded-lg border p-4 space-y-2',
        isComplete ? 'border-green-600/30 bg-green-900/10' : 'border-orange-600/30 bg-orange-900/10',
        hasError && 'border-red-600/30 bg-red-900/10',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {isComplete ? (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-orange-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span className="font-medium text-sm text-white">
          {tool.toolName}
        </span>
        {isComplete && (
          <span className="ml-auto text-xs text-green-400">Complete</span>
        )}
      </div>

      {tool.args && Object.keys(tool.args).length > 0 && (
        <div className="text-xs text-gray-400 space-y-1">
          {Object.entries(tool.args).map(([key, value]) => (
            <div key={key}>
              <span className="text-gray-500">{key}:</span>{' '}
              <span className="text-gray-300">{JSON.stringify(value)}</span>
            </div>
          ))}
        </div>
      )}

      {hasError && (
        <div className="text-xs text-red-400 bg-red-900/20 rounded p-2">
          Error: {tool.error}
        </div>
      )}

      {isComplete && 'result' in tool && (
        <div className="text-xs text-gray-300 bg-gray-900/50 rounded p-2 max-h-32 overflow-auto">
          {typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result, null, 2)}
        </div>
      )}
    </div>
  )
}
