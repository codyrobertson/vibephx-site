'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintButton() {
  return (
    <Button
      className="w-full justify-between bg-orange-500 hover:bg-orange-600"
      onClick={() => window.print()}
    >
      Print Version
      <Printer className="ml-2 h-4 w-4" />
    </Button>
  )
}
