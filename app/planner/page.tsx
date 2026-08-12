"use client";

import { useState } from "react";
import { Sparkles, Star } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PlannerForm } from "@/features/planner/components/PlannerForm";
import { ItineraryResult } from "@/features/planner/components/ItineraryResult";
import type { ItineraryResponse, PlannerFormValues } from "@/features/planner/types/itinerary";

export default function PlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);

  async function handleSubmit(values: PlannerFormValues) {
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setItinerary(data.itinerary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }
 

  return (
  <>
    <Navbar />
    <main className="relative">
      {/* Fixed, full-viewport mesh gradient — stays behind everything no matter how long
          the page grows once an itinerary is generated, so it never runs out on scroll. */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-background"
        style={{
          backgroundImage:
            "radial-gradient(1200px 700px at 12% 0%, rgba(37,99,235,0.16), transparent 55%), " +
            "radial-gradient(1000px 650px at 90% 12%, rgba(20,184,166,0.14), transparent 55%), " +
            "radial-gradient(900px 600px at 50% 100%, rgba(249,115,22,0.10), transparent 55%), " +
            "radial-gradient(700px 500px at 8% 85%, rgba(37,99,235,0.08), transparent 55%)",
        }}
      />

      <section className="pt-32 pb-10 md:pt-40 md:pb-12">
        <div className="mx-auto max-w-2xl px-5 text-center md:px-8">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            AI Itinerary Planner
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">
            Let&apos;s plan your next journey
          </h1>
          <p className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
            Tell us where you&apos;re headed, your budget, and what you love — we&apos;ll
            build a real day-by-day plan grounded in how the trip is actually done.
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-14">
          <PlannerForm onSubmit={handleSubmit} isLoading={isLoading} />

          {/* Signature element: glass-framed trip card stack, grounded with a soft glow */}
          <div className="relative hidden lg:sticky lg:top-28 lg:block">
            <div className="relative h-[440px]">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-16 -z-10 rounded-full bg-gradient-to-br from-primary/25 via-gem/20 to-accent/10 blur-3xl"
              />

              <div className="absolute right-0 top-8 w-64 -rotate-3 overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-2xl shadow-primary/20 backdrop-blur-xl transition-transform hover:-translate-y-1 hover:rotate-0">
                <div className="relative h-40 w-full">
                  <img
                    src="/images/dest-tirthan.png"
                    alt="Tirthan Valley"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    4.9
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground">Tirthan Valley</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">4 days · ₹14,200 planned</p>
                </div>
              </div>

              <div className="absolute left-0 bottom-4 w-60 rotate-2 overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-2xl shadow-gem/20 backdrop-blur-xl transition-transform hover:-translate-y-1 hover:rotate-0">
                <div className="relative h-36 w-full">
                  <img
                    src="/images/gem-lake.png"
                    alt="A hidden alpine lake"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    5.0
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground">Spiti Circuit</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">6 days · ₹22,500 planned</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-auto mt-6 max-w-5xl px-5 md:px-8">
            <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-md">
              {error}
            </p>
          </div>
        )}

        {itinerary && (
          <div className="mx-auto mt-10 max-w-5xl px-5 md:px-8">
            <ItineraryResult itinerary={itinerary} />
          </div>
        )}
      </section>
    </main>
     <Footer />
  </>
);
}
