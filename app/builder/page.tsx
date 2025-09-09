import { redirect } from 'next/navigation'

export default function BuilderPage() {
  // Redirect to new route-based flow
  redirect('/builder/template')
}

export const metadata = {
  title: 'AI Project Builder | VibePHX',
  description: 'Build your complete app development blueprint with AI. Get PRD, technical specs, UI design, database schema, and marketing plan in minutes.',
}