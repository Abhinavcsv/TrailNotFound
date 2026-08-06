"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { PlannerFormValues } from "../types/itinerary";

const INTEREST_OPTIONS = [
  "Trekking",
  "Nature",
  "Culture & Heritage",
  "Food",
  "Adventure Sports",
  "Wildlife",
  "Photography",
  "Relaxation",
];

const TRAVEL_STYLES = [
  { value: "budget", label: "Budget" },
  { value: "balanced", label: "Balanced" },
  { value: "luxury", label: "Luxury" },
];

interface PlannerFormProps {
  onSubmit: (values: PlannerFormValues) => void;
  isLoading: boolean;
}

export function PlannerForm({ onSubmit, isLoading }: PlannerFormProps) {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState(15000);
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState("balanced");

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination.trim() || !startLocation.trim()) return;
    onSubmit({
      startLocation: startLocation.trim(),
      destination: destination.trim(),
      endLocation: endLocation.trim() || startLocation.trim(),
      days,
      budget,
      interests,
      travelStyle,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan your trip</CardTitle>
        <CardDescription>
          Tell us where and how you want to travel — our AI will build a day-by-day itinerary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startLocation">Starting from</Label>
              <Input
                id="startLocation"
                placeholder="e.g. Delhi"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="endLocation">Ending at (optional)</Label>
              <Input
                id="endLocation"
                placeholder="Same as start, unless different"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g. Tirthan Valley, Himachal Pradesh"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="days">Trip length (days)</Label>
              <Input
                id="days"
                type="number"
                min={1}
                max={21}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="budget">Budget (INR)</Label>
              <Input
                id="budget"
                type="number"
                min={1000}
                step={1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const active = interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                      (active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted")
                    }
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Travel style</Label>
            <div className="flex gap-2">
              {TRAVEL_STYLES.map((style) => (
                <button
                  type="button"
                  key={style.value}
                  onClick={() => setTravelStyle(style.value)}
                  className={
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors " +
                    (travelStyle === style.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted")
                  }
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" disabled={isLoading} className="mt-2">
            {isLoading ? "Generating your itinerary..." : "Generate Itinerary"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
