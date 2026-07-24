import { Navbar } from '@/components/shared/navbar'
import { Hero } from '@/components/landing/hero'
import { FeaturedDestinations } from '@/components/landing/featured-destinations'
import { ExploreInterests } from '@/components/landing/explore-interests'
import { HiddenGems } from '@/components/landing/hidden-gems'
import { AiPlanner } from '@/components/landing/ai-planner'
import { CommunityStories } from '@/components/landing/community-stories'
import { TopExplorers } from '@/components/landing/top-explorers'
import { Stats } from '@/components/landing/stats'
import { Cta } from '@/components/landing/cta'
import { Footer } from '@/components/shared/footer'

export default function Page() {
  return (
    <main className="relative bg-background">
      <Navbar />
      <Hero />
      <FeaturedDestinations />
      <ExploreInterests />
      <HiddenGems />
      <AiPlanner />
      <CommunityStories />
      <TopExplorers />
      <Stats />
      <Cta />
      <Footer />
    </main>
  )
}
