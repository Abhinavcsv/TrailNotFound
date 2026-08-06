"use client";

import { useState } from "react";
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
    <main className="mx-auto max-w-3xl px-4 pt-28 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">AI Itinerary Planner</h1>
        <p className="text-sm text-muted-foreground">
          Describe your trip and let AI build a personalized day-by-day plan.
        </p>
      </div>

      <PlannerForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {itinerary && (
        <div className="mt-10">
          <ItineraryResult itinerary={itinerary} />
        </div>
      )}
    </main>
  );
}
