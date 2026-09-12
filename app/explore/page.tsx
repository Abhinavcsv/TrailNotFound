"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Sparkles, SlidersHorizontal } from "lucide-react"
import { PageHero } from "@/components/shared/page-hero"
import { DestinationCard } from "@/features/explore/components/DestinationCard"
import { destinations } from "@/data/destinations"
import type { Destination } from "@/features/explore/types/destination"

const categories = ["All", ...Array.from(new Set(destinations.map((d) => d.category)))]

export default function ExplorePage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [hiddenGemsOnly, setHiddenGemsOnly] = useState(false)

  const filteredDestinations = useMemo(() => {
    const search = query.trim().toLowerCase()

    return destinations.filter((destination: Destination) => {
      const matchesSearch =
        !search ||
        destination.name.toLowerCase().includes(search) ||
        destination.state.toLowerCase().includes(search) ||
        destination.category.toLowerCase().includes(search)

      const matchesCategory =
        category === "All" ||
        destination.category === category

      const matchesHiddenGem =
        !hiddenGemsOnly || destination.hiddenGem

      return (
        matchesSearch &&
        matchesCategory &&
        matchesHiddenGem
      )
    })
  }, [query, category, hiddenGemsOnly])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [category])

  return (
    <main className="relative bg-background">
      <PageHero
        eyebrow="Explore Destinations"
        title="Find your next escape"
        subtitle="Low-key hill treks and waterfalls across India — the trails and cascades most travel guides skip."
        heightClassName="h-[48svh] min-h-[380px]"
      />

      <section className="relative -mt-12 pb-24 md:-mt-16 md:pb-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">

          {/* Search + Filters */}
          <div className="rounded-3xl bg-card p-4 shadow-lg shadow-foreground/5 ring-1 ring-border/60">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Search destinations, states..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/10"
                />
              </div>

              {/* Hidden Gems */}
              <button
                onClick={() =>
                  setHiddenGemsOnly((value) => !value)
                }
                className={
                  "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-all " +
                  (hiddenGemsOnly
                    ? "border-gem bg-gem text-white shadow-md shadow-gem/20"
                    : "border-border bg-background hover:bg-muted")
                }
              >
                <Sparkles className="h-4 w-4" />
                Hidden Gems
              </button>
            </div>

            {/* Categories */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
              <SlidersHorizontal className="mr-1 h-4 w-4 shrink-0 text-muted-foreground" />

              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={
                    "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all " +
                    (category === item
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background hover:bg-muted")
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {filteredDestinations.length}
              </span>{" "}
              destinations found
            </p>

            {(query || category !== "All" || hiddenGemsOnly) && (
              <button
                onClick={() => {
                  setQuery("")
                  setCategory("All")
                  setHiddenGemsOnly(false)
                }}
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Cards */}
          {filteredDestinations.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDestinations.map(
                (destination, index) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    index={index}
                  />
                )
              )}
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center justify-center text-center">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-muted">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>

              <h2 className="font-display text-xl font-semibold">
                No destinations found
              </h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Try searching for another destination, state,
                or category.
              </p>

              <button
                onClick={() => {
                  setQuery("")
                  setCategory("All")
                  setHiddenGemsOnly(false)
                }}
                className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Show all destinations
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}