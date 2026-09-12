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
  Clock,
} from "lucide-react"

import { prisma } from "@/lib/prisma"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function DestinationPage({
  params,
}: PageProps) {
  const { id } = await params

  const place = await prisma.place.findUnique({
    where: {
      id,
    },
    include: {
      categories: {
        select: {
          name: true,
          slug: true,
        },
      },
      city: true,
      state: true,
    },
  })

  if (!place) {
    notFound()
  }

  const primaryCategory =
    place.categories[0]?.name || "Destination"

  const locationParts = [
    place.city?.name,
    place.state?.name,
    "India",
  ].filter(Boolean)

  const location =
    locationParts.length > 0
      ? locationParts.join(", ")
      : "India"

  const plannerUrl = `/ai-planner?destination=${encodeURIComponent(
    place.name
  )}`

  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative h-[55svh] min-h-[460px] overflow-hidden">
        {place.coverImage ? (
          <img
            src={place.coverImage}
            alt={place.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-black" />
        )}

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-12 md:px-8 md:pb-16">
          <div className="max-w-4xl text-white">
            <div className="mb-4 flex flex-wrap gap-2">
              {place.categories.map((category) => (
                <span
                  key={category.slug}
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-md"
                >
                  {category.name}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {place.name}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-white/85">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-8">
            {/* DESCRIPTION */}
            <section className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm md:p-9">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Compass className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Discover
                  </p>

                  <h2 className="font-display text-2xl font-semibold">
                    About {place.name}
                  </h2>
                </div>
              </div>

              <p className="text-base leading-8 text-muted-foreground md:text-lg">
                {place.description}
              </p>
            </section>

            {/* ACTIVITIES */}
            <section className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm md:p-9">
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Things to do
                </p>

                <h2 className="mt-1 font-display text-2xl font-semibold">
                  Activities you can enjoy
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Make the most of your visit with these experiences.
                </p>
              </div>

              {place.activities.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {place.activities.map((activity) => (
                    <div
                      key={activity}
                      className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background p-4"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="h-4 w-4" />
                      </div>

                      <span className="text-sm font-medium leading-6">
                        {activity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Activities information coming soon.
                </p>
              )}
            </section>

            {/* LOCATION */}
            <section className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm md:p-9">
              <h2 className="font-display text-2xl font-semibold">
                Location
              </h2>

              <div className="mt-5 rounded-2xl bg-muted/40 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-medium">
                      {location}
                    </p>

                    {place.latitude && place.longitude && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {place.latitude.toFixed(5)},{" "}
                        {place.longitude.toFixed(5)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
              <div className="border-b border-border/60 px-6 py-5">
                <h2 className="font-display text-xl font-semibold">
                  Travel Information
                </h2>
              </div>

              {/* RATING */}
              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Star className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Rating
                  </p>

                  <p className="mt-0.5 font-semibold">
                    {place.rating > 0
                      ? `${place.rating.toFixed(1)} / 5`
                      : "Not rated yet"}
                  </p>
                </div>
              </div>

              {/* BUDGET */}
              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                  <IndianRupee className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Average Budget
                  </p>

                  <p className="mt-0.5 font-semibold">
                    {place.avgBudget
                      ? `₹${place.avgBudget.toLocaleString("en-IN")} / person`
                      : "Budget information coming soon"}
                  </p>
                </div>
              </div>

              {/* BEST TIME */}
              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Best Time to Visit
                  </p>

                  <p className="mt-0.5 font-semibold">
                    {place.bestTimeToVisit ||
                      "Information coming soon"}
                  </p>
                </div>
              </div>

              {/* LOCATION */}
              <div className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Location
                  </p>

                  <p className="mt-0.5 font-semibold">
                    {location}
                  </p>
                </div>
              </div>
            </div>

            {/* AI PLANNER */}
            <div className="mt-5 overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Sparkles className="h-6 w-6" />
              </div>

              <h2 className="mt-5 font-display text-2xl font-semibold">
                Plan your trip with AI
              </h2>

              <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                Let AI create a personalized itinerary for {place.name}
                based on your dates, budget and interests.
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

            {/* QUICK INFO */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                Your AI itinerary can be customized to your schedule.
              </span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}