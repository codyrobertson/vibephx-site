'use client'

import Hero from '@/components/Hero'
import CorePrinciples from '@/components/CorePrinciples'
import Features from '@/components/Features'
import BuildTracks from '@/components/BuildTracks'
import Schedule from '@/components/Schedule'
import Methodology from '@/components/Methodology'
import ValueProp from '@/components/ValueProp'
import Instructor from '@/components/Instructor'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <CorePrinciples />
      <Features />
      <BuildTracks />
      <Schedule />
      <Methodology />
      <ValueProp />
      <CTA />
      <Instructor />
      <FAQ />
      <Footer />
    </main>
  )
}