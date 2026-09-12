import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  CalendarDays,
  IndianRupee,
  MapPin,
  Sparkles,
  Star,
  Compass,
  Gauge,
} from "lucide-react"

import { destinations } from "@/data/destinations"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function DestinationPage({ params }: PageProps) {
  const { id } = await params

  const place = destinations.find((d) => d.id === id)

  if (!place) {
    notFound()
  }

  const plannerUrl = `/planner?destination=${encodeURIComponent(place.name)}`

  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative h-[55svh] min-h-[460px] overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-12 md:px-8 md:pb-16">
          <div className="max-w-4xl text-white">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-md">
                {place.category}
              </span>
              {place.hiddenGem && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gem px-4 py-1.5 text-sm font-medium text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                  Hidden Gem
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {place.name}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-white/85">
              <MapPin className="h-4 w-4" />
              <span>{place.state}, India</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-8">
            <section className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm md:p-9">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Compass className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Discover
                  </p>
                  <h2 className="font-display text-2xl font-semibold">About {place.name}</h2>
                </div>
              </div>

              <p className="text-base leading-8 text-muted-foreground md:text-lg">
                {place.description}
              </p>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
              <div className="border-b border-border/60 px-6 py-5">
                <h2 className="font-display text-xl font-semibold">Travel Information</h2>
              </div>

              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="mt-0.5 font-semibold">{place.rating.toFixed(1)} / 5</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Budget</p>
                  <p className="mt-0.5 font-semibold">
                    ₹{place.budget.toLocaleString("en-IN")} / person
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="mt-0.5 font-semibold">{place.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
                  <Gauge className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                  <p className="mt-0.5 font-semibold">{place.difficulty}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Best Season</p>
                  <p className="mt-0.5 font-semibold">{place.bestSeason}</p>
                </div>
              </div>
            </div>

            {/* AI PLANNER CTA */}
            <div className="mt-5 overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Sparkles className="h-6 w-6" />
              </div>

              <h2 className="mt-5 font-display text-2xl font-semibold">Plan your trip with AI</h2>

              <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                Let AI create a personalized itinerary for {place.name} based on your dates,
                budget and interests.
              </p>

              <Link
                href={plannerUrl}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-primary transition-transform hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4" />
                Plan my trip
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
