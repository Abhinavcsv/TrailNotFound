import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  IndianRupee,
  MapPin,
  Sparkles,
  Star,
  Compass,
  Gauge,
  Mountain,
  Trees,
  Route,
  Utensils,
  Hotel,
  Lightbulb,
  Clock,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import { destinations } from "@/data/destinations";
import { tirthanValleyDetails } from "@/data/destination-details/tirthan-valley";
import { BackButton } from "@/components/shared/back-button";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </p>

      <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export default async function DestinationPage({ params }: PageProps) {
  const { id } = await params;

  const place = destinations.find((d) => d.id === id);

  if (!place) {
    notFound();
  }

  const isTirthan = place.id === "tirthan-valley";
  const details = isTirthan ? tirthanValleyDetails : null;

  const plannerUrl = `/planner?destination=${encodeURIComponent(place.name)}`;

  return (
    <main className="min-h-screen bg-background">
      {/* =========================================================
          HERO
      ========================================================= */}
      {/* HERO */}
<section className="relative h-[55svh] min-h-[460px] overflow-hidden">
  <img
    src={place.image}
    alt={place.name}
    className="absolute inset-0 h-full w-full object-cover"
  />

  <div className="absolute inset-0 bg-black/45" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

  {/* Hero content */}
  <div className="relative mx-auto flex h-full max-w-7xl flex-col px-5 pb-12 pt-24 md:px-8 md:pb-16 md:pt-28">

    {/* Back button */}
    <div className="mb-8 shrink-0 md:mb-10">
      <BackButton
        fallbackHref="/explore"
        label="Back to Explore"
      />
    </div>

    {/* Destination information */}
    <div className="mt-auto max-w-4xl text-white">

      {/* Category tags */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
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

      {details && (
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
          {details.overview.introduction}
        </p>
      )}
    </div>
  </div>
</section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}
          <div className="min-w-0 space-y-8">
            {/* ABOUT */}
            <section
              id="about"
              className="scroll-mt-24 rounded-3xl border border-border/70 bg-card p-7 shadow-sm md:p-9"
            >
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
                {details?.overview.introduction ?? place.description}
              </p>

              {details && (
                <>
                  <div className="mt-8">
                    <h3 className="mb-4 font-semibold">
                      What makes it special?
                    </h3>

                    <ul className="grid gap-3 sm:grid-cols-2">
                      {details.overview.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 border-t border-border/60 pt-7">
                    <h3 className="mb-4 font-semibold">
                      Best suited for
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {details.overview.bestFor.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </section>

            {details && (
              <>
                {/* =================================================
                    ATTRACTIONS
                ================================================= */}
                <section
                  id="attractions"
                  className="scroll-mt-24"
                >
                  <SectionHeading
                    eyebrow="Explore the region"
                    title="Places to explore"
                    description={`Discover the attractions and surrounding areas of ${place.name}.`}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    {details.attractions.map((item, index) => (
                      <article
                        key={item.name}
                        className="rounded-2xl border border-border/70 bg-card p-6 transition-colors hover:border-primary/40"
                      >
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Mountain className="h-5 w-5" />
                        </div>

                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          PLACE {String(index + 1).padStart(2, "0")}
                        </p>

                        <h3 className="font-display text-lg font-semibold">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {item.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                {/* =================================================
                    ACTIVITIES
                ================================================= */}
                <section
                  id="activities"
                  className="scroll-mt-24"
                >
                  <SectionHeading
                    eyebrow="Experience more"
                    title="Things to do"
                    description="Make the most of your visit with these experiences."
                  />

                  <div className="space-y-3">
                    {details.activities.map((activity) => (
                      <article
                        key={activity.name}
                        className="flex gap-4 rounded-2xl border border-border/70 bg-card p-5"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                          <Trees className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-semibold">
                              {activity.name}
                            </h3>

                            {activity.duration && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                {activity.duration}
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* =================================================
                    NEARBY PLACES
                ================================================= */}
                <section
                  id="nearby"
                  className="scroll-mt-24"
                >
                  <SectionHeading
                    eyebrow="Go beyond"
                    title="Nearby places"
                    description="Explore more locations in the surrounding region."
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    {details.nearbyPlaces.map((item) => (
                      <article
                        key={item.name}
                        className="rounded-2xl border border-border/70 bg-card p-5"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />

                          <h3 className="font-semibold">
                            {item.name}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {item.description}
                        </p>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${item.name}, ${place.state}, India`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                          View on map
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </article>
                    ))}
                  </div>
                </section>

                {/* =================================================
                    INTERACTIVE MAP
                ================================================= */}
                {isTirthan && (
                  <section className="space-y-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                          Find your way
                        </p>

                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                          Explore Tirthan Valley on Map
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                          Explore the valley, nearby villages and surrounding attractions.
                        </p>
                      </div>

                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Tirthan+Valley+Himachal+Pradesh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                      >
                        Open in Google Maps
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
                      <iframe
                        title="Map showing Tirthan Valley, Himachal Pradesh"
                        src="https://maps.google.com/maps?q=Tirthan%20Valley%2C%20Himachal%20Pradesh&t=&z=11&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="420"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="block w-full"
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Map provided by Google Maps. Locations and routes may change; verify
                      local travel conditions before starting your journey.
                    </p>
                  </section>
                )}

                {/* =================================================
                    HOW TO REACH
                ================================================= */}
                <section
                  id="reach"
                  className="scroll-mt-24 rounded-3xl border border-border/70 bg-card p-7 md:p-8"
                >
                  <SectionHeading
                    eyebrow="Plan your journey"
                    title="How to reach"
                    description={`Ways to reach ${place.name}. Confirm current schedules and road conditions before travelling.`}
                  />

                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Route className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          By road
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {details.howToReach.byRoad}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                        <Route className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          By train
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {details.howToReach.nearestRailwayStation}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                        <Route className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          By air
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {details.howToReach.nearestAirport}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* =================================================
                    STAY AND FOOD
                ================================================= */}
                <section
                  id="stay"
                  className="scroll-mt-24"
                >
                  <SectionHeading
                    eyebrow="Stay and dine"
                    title="Accommodation & local food"
                    description="A few options and experiences to consider during your stay."
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-border/70 bg-card p-6">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                        <Hotel className="h-5 w-5" />
                      </div>

                      <h3 className="font-display text-xl font-semibold">
                        Where to stay
                      </h3>

                      <ul className="mt-5 space-y-3">
                        {details.accommodation.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-sm leading-6 text-muted-foreground"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-3xl border border-border/70 bg-card p-6">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                        <Utensils className="h-5 w-5" />
                      </div>

                      <h3 className="font-display text-xl font-semibold">
                        What to eat
                      </h3>

                      <ul className="mt-5 space-y-3">
                        {details.localFood.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-sm leading-6 text-muted-foreground"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* =================================================
                    ITINERARY
                ================================================= */}
                <section
                  id="itinerary"
                  className="scroll-mt-24"
                >
                  <SectionHeading
                    eyebrow="Make a plan"
                    title="Suggested 4-day itinerary"
                    description="A flexible starting plan. Adjust it according to your arrival time, weather and local conditions."
                  />

                  <div className="space-y-4">
                    {details.itinerary.map((day) => (
                      <article
                        key={day.day}
                        className="relative rounded-2xl border border-border/70 bg-card p-6"
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                            DAY {day.day}
                          </span>

                          <h3 className="font-display text-lg font-semibold">
                            {day.title}
                          </h3>
                        </div>

                        <ul className="mt-5 space-y-3">
                          {day.activities.map((activity) => (
                            <li
                              key={activity}
                              className="flex gap-3 text-sm leading-6 text-muted-foreground"
                            >
                              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>

                {/* =================================================
                    TRAVEL TIPS
                ================================================= */}
                <section
                  id="tips"
                  className="scroll-mt-24 rounded-3xl border border-border/70 bg-card p-7 md:p-8"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                      <Lightbulb className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Before you go
                      </p>

                      <h2 className="font-display text-2xl font-semibold">
                        Travel tips
                      </h2>
                    </div>
                  </div>

                  <ul className="grid gap-4 sm:grid-cols-2">
                    {details.travelTips.map((tip) => (
                      <li
                        key={tip}
                        className="flex gap-3 text-sm leading-7 text-muted-foreground"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* =================================================
                    FAQ
                ================================================= */}
                <section
                  id="faq"
                  className="scroll-mt-24"
                >
                  <SectionHeading
                    eyebrow="Good to know"
                    title="Frequently asked questions"
                  />

                  <div className="space-y-3">
                    {details.faqs.map((faq) => (
                      <details
                        key={faq.question}
                        className="group rounded-2xl border border-border/70 bg-card p-5"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                          {faq.question}

                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                        </summary>

                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* =====================================================
              RIGHT SIDEBAR
          ===================================================== */}
          <aside className="h-fit self-start lg:sticky lg:top-24">
            {/* Travel information */}
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
              <div className="border-b border-border/60 px-6 py-5">
                <h2 className="font-display text-xl font-semibold">
                  Travel Information
                </h2>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Star className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Rating
                  </p>

                  <p className="mt-0.5 font-semibold">
                    {place.rating.toFixed(1)} / 5
                  </p>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                  <IndianRupee className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Estimated Budget
                  </p>

                  <p className="mt-0.5 font-semibold">
                    ₹{place.budget.toLocaleString("en-IN")} / person
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Planning estimate; confirm current costs.
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Duration
                  </p>

                  <p className="mt-0.5 font-semibold">
                    {place.duration}
                  </p>
                </div>
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-4 border-b border-border/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
                  <Gauge className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Difficulty
                  </p>

                  <p className="mt-0.5 font-semibold">
                    {place.difficulty}
                  </p>
                </div>
              </div>

              {/* Best season */}
              <div className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Best Season
                  </p>

                  <p className="mt-0.5 font-semibold">
                    {place.bestSeason ?? "Check local conditions"}
                  </p>
                </div>
              </div>
            </div>

            {/* AI PLANNER CTA */}
            <div className="mt-5 overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Sparkles className="h-6 w-6" />
              </div>

              <h2 className="mt-5 font-display text-2xl font-semibold">
                Plan your trip with AI
              </h2>

              <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                Let AI create a personalized itinerary for {place.name} based
                on your dates, budget and interests.
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
  );
}
