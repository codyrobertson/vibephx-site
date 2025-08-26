import BuilderWizard from '@/components/builder/BuilderWizard'

export default function BuilderPage() {
  return (
    <div className="h-screen bg-black flex flex-col pt-8 md:pt-12">
      <div className="container mx-auto px-4 flex-1 flex flex-col max-h-full overflow-hidden">
        {/* Wizard - Takes full space */}
        <div className="flex-1 overflow-hidden">
          <BuilderWizard />
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'AI Project Builder | VibePHX',
  description: 'Build your complete app development blueprint with AI. Get PRD, technical specs, UI design, database schema, and marketing plan in minutes.',
}