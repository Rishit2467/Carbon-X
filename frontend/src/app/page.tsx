'use client'

import { Hero } from '@/components/Hero'
import { StatsOverview } from '@/components/StatsOverview'
import { FeaturedCredits } from '@/components/FeaturedCredits'

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />
      <StatsOverview />
      <FeaturedCredits />
    </div>
  )
}
