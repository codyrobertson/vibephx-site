import { Button } from '@/components/ui/button'
export function ConfirmButtons({
  onContinue,
  onMore,
  onNotQuite
}: {
  onContinue: () => void
  onMore: () => void
  onNotQuite: () => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <Button onClick={onContinue} variant="default">
        That's Right → Continue
      </Button>
      <Button onClick={onMore} variant="outline">
        One More Thing
      </Button>
      <Button onClick={onNotQuite} variant="outline">
        Not Quite
      </Button>
    </div>
  )
}

