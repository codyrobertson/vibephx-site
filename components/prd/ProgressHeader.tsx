export function ProgressHeader({
  currentPhase,
  phaseLabel,
  progress,
  hasStarted
}: {
  currentPhase: string
  phaseLabel: string
  progress: number
  hasStarted: boolean
}) {
  return (
    <div className={`sticky top-0 z-20 bg-black/95 backdrop-blur border-b border-gray-800 transition-all duration-300 ${!hasStarted ? 'py-12' : 'py-4'}`}>
      <div className={`${!hasStarted ? 'text-center' : 'flex items-center justify-between'} max-w-5xl mx-auto px-4 transition-all duration-300`}>
        <div className={!hasStarted ? '' : 'flex items-center gap-4'}>
          <h1 className={`font-bold text-white transition-all duration-300 ${!hasStarted ? 'text-4xl mb-2' : 'text-2xl'}`}>
            PRD Builder
          </h1>
          {!hasStarted && (
            <p className="text-gray-400 text-lg">
              Plan → Loop → Ship. Let's turn your idea into a shippable PRD.
            </p>
          )}
        </div>
        {currentPhase !== 'intro' && hasStarted && (
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-400">{phaseLabel}</div>
            <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-400">{Math.round(progress)}%</div>
          </div>
        )}
      </div>
    </div>
  )
}

