"use client";

import {
  CalendarDays,
  Clock,
  Lightbulb,
  MapPin,
  Wallet,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Route,
} from "lucide-react";

import type { ItineraryResponse } from "../types/itinerary";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ItineraryResult({
  itinerary,
}: {
  itinerary: ItineraryResponse;
}) {
  const totalDays = itinerary.days.length;

  return (
    <section className="space-y-6">
      {/* =========================
          TRIP HERO
      ========================== */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-2xl shadow-primary/10 backdrop-blur-2xl sm:p-8">
        {/* Decorative background */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        />

        <div className="relative">
          {/* Label */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Your trip is ready
          </div>

          {/* Destination */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Your next adventure
              </div>

              <h2 className="max-w-3xl font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {itinerary.destination}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {itinerary.summary}
              </p>
            </div>

            {/* Cost */}
            <div className="shrink-0 rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4 md:min-w-[190px]">
              <p className="text-xs font-medium text-muted-foreground">
                Estimated trip cost
              </p>

              <p className="mt-1 text-2xl font-extrabold text-primary">
                {formatINR(itinerary.totalEstimatedCost)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-white/70 p-4">
              <CalendarDays className="mb-2 h-4 w-4 text-primary" />
              <p className="text-lg font-bold text-foreground">
                {totalDays}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalDays === 1 ? "Day" : "Days"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-white/70 p-4">
              <Wallet className="mb-2 h-4 w-4 text-primary" />
              <p className="text-lg font-bold text-foreground">
                {formatINR(itinerary.totalEstimatedCost)}
              </p>
              <p className="text-xs text-muted-foreground">
                Estimated total
              </p>
            </div>

            <div className="col-span-2 rounded-2xl border border-border/60 bg-white/70 p-4 sm:col-span-1">
              <Route className="mb-2 h-4 w-4 text-primary" />
              <p className="text-lg font-bold text-foreground">
                Day by day
              </p>
              <p className="text-xs text-muted-foreground">
                Personalized itinerary
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          ITINERARY HEADER
      ========================== */}
      <div className="px-1 pt-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Your itinerary
        </p>

        <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-foreground">
          Make the most of every day.
        </h3>
      </div>

      {/* =========================
          DAY TIMELINE
      ========================== */}
      <div className="space-y-5">
        {itinerary.days.map((day) => (
          <article
            key={day.day}
            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-xl shadow-primary/5 backdrop-blur-xl"
          >
            {/* Day header */}
            <div className="border-b border-border/50 bg-white/50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground shadow-lg shadow-primary/20">
                    {day.day}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      Day {day.day}
                    </p>

                    <h4 className="mt-0.5 font-display text-lg font-bold text-foreground">
                      {day.title}
                    </h4>
                  </div>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  <Wallet className="h-3.5 w-3.5" />
                  {formatINR(day.estimatedCost)}
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="p-5 sm:p-6">
              <div className="relative">
                {/* Timeline line */}
                <div
                  aria-hidden
                  className="absolute bottom-4 left-[7px] top-4 w-px bg-border"
                />

                <div className="space-y-6">
                  {day.activities.map((activity, index) => (
                    <div
                      key={`${day.day}-${index}`}
                      className="relative flex gap-4"
                    >
                      {/* Timeline dot */}
                      <div className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-4 border-white bg-primary shadow-sm" />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </span>

                          {index === 0 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              Start
                            </span>
                          )}
                        </div>

                        <h5 className="mt-1 text-sm font-bold text-foreground">
                          {activity.title}
                        </h5>

                        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* =========================
          TRIP SUMMARY
      ========================== */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Budget */}
        <div className="rounded-[2rem] border border-primary/15 bg-primary/5 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </div>

            <div>
              <h3 className="font-display font-bold text-foreground">
                Trip budget
              </h3>

              <p className="text-xs text-muted-foreground">
                Estimated overall cost
              </p>
            </div>
          </div>

          <p className="text-3xl font-extrabold text-primary">
            {formatINR(itinerary.totalEstimatedCost)}
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-primary/10">
            <div className="h-full w-3/4 rounded-full bg-primary" />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Estimated spend</span>
            <span>Plan accordingly</span>
          </div>
        </div>

        {/* Quick overview */}
        <div className="rounded-[2rem] border border-border/60 bg-white/70 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>

            <div>
              <h3 className="font-display font-bold text-foreground">
                Trip overview
              </h3>

              <p className="text-xs text-muted-foreground">
                Everything planned for you
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Days planned</span>
              <span className="font-semibold text-foreground">
                {totalDays}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Activities</span>
              <span className="font-semibold text-foreground">
                {itinerary.days.reduce(
                  (total, day) => total + day.activities.length,
                  0,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated spend</span>
              <span className="font-semibold text-foreground">
                {formatINR(itinerary.totalEstimatedCost)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          TRAVEL TIPS
      ========================== */}
      {itinerary.travelTips.length > 0 && (
        <div className="rounded-[2rem] border border-accent/20 bg-accent/5 p-6 shadow-lg shadow-accent/5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-white shadow-md">
              <Lightbulb className="h-4 w-4" />
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Travel tips
              </h3>

              <p className="text-xs text-muted-foreground">
                A few things worth knowing before you go.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {itinerary.travelTips.map((tip, index) => (
              <div
                key={index}
                className="flex gap-3 rounded-2xl border border-white/70 bg-white/70 p-4"
              >
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================
          BOTTOM CTA
      ========================== */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-lg backdrop-blur-xl sm:flex-row sm:p-6">
        <div>
          <p className="font-display font-bold text-foreground">
            Ready for your adventure?
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Your itinerary is just the beginning.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
        >
          Refine this trip
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}