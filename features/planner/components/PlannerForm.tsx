"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  CalendarDays,
  Wallet,
  Sparkles,
  Compass,
  Mountain,
  Trees,
  Camera,
  Utensils,
  PawPrint,
  Landmark,
  Heart,
  Plus,
  Minus,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PlannerFormValues } from "../types/itinerary";

const INTEREST_OPTIONS = [
  { value: "Trekking", label: "Trekking", icon: Mountain },
  { value: "Nature", label: "Nature", icon: Trees },
  { value: "Culture & Heritage", label: "Culture", icon: Landmark },
  { value: "Food", label: "Food", icon: Utensils },
  { value: "Adventure Sports", label: "Adventure", icon: Compass },
  { value: "Wildlife", label: "Wildlife", icon: PawPrint },
  { value: "Photography", label: "Photography", icon: Camera },
  { value: "Relaxation", label: "Relaxation", icon: Heart },
];

const TRAVEL_STYLES = [
  {
    value: "budget",
    label: "Budget",
    description: "Travel smart",
    emoji: "💰",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Best of both",
    emoji: "⚖️",
  },
  {
    value: "luxury",
    label: "Luxury",
    description: "Comfort first",
    emoji: "✨",
  },
];

interface PlannerFormProps {
  onSubmit: (values: PlannerFormValues) => void;
  isLoading: boolean;
}

export function PlannerForm({ onSubmit, isLoading }: PlannerFormProps) {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState(15000);
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState("balanced");
  const [surpriseMe, setSurpriseMe] = useState(false);

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  }

  function decreaseDays() {
    setDays((current) => Math.max(1, current - 1));
  }

  function increaseDays() {
    setDays((current) => Math.min(21, current + 1));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!startLocation.trim()) return;
    if (!surpriseMe && !destination.trim()) return;

    onSubmit({
      startLocation: startLocation.trim(),
      destination: surpriseMe ? "Surprise me" : destination.trim(),
      endLocation: startLocation.trim(),
      days,
      budget,
      interests,
      travelStyle,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-2xl shadow-primary/10 backdrop-blur-2xl sm:p-7 md:p-9"
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            YOUR TRIP, YOUR WAY
          </div>

          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Tell us about your adventure.
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Give us a few details and we&apos;ll turn them into a personalized
            day-by-day journey.
          </p>
        </div>

        <div className="space-y-7">
          {/* Starting location */}
          <div>
            <label
              htmlFor="startLocation"
              className="mb-2.5 block text-sm font-semibold text-foreground"
            >
              Where are you starting from?
            </label>

            <div className="relative">
              <Navigation className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-primary" />

              <input
                id="startLocation"
                type="text"
                placeholder="e.g. Delhi, Mumbai, Chandigarh"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                required
                className="h-14 w-full rounded-2xl border border-border/70 bg-white/80 pl-11 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <label
                htmlFor="destination"
                className="text-sm font-semibold text-foreground"
              >
                Where do you want to go?
              </label>

              <button
                type="button"
                onClick={() => {
                  setSurpriseMe((current) => !current);
                  if (!surpriseMe) setDestination("");
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  surpriseMe
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-primary/10 text-primary hover:bg-primary/15"
                }`}
              >
                <WandSparkles className="h-3.5 w-3.5" />
                Surprise me
              </button>
            </div>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-primary" />

              <input
                id="destination"
                type="text"
                placeholder={
                  surpriseMe
                    ? "AI will choose a destination for you"
                    : "e.g. Tirthan Valley, Himachal Pradesh"
                }
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={surpriseMe}
                className={`h-14 w-full rounded-2xl border border-border/70 pl-11 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
                  surpriseMe
                    ? "cursor-not-allowed bg-primary/5"
                    : "bg-white/80"
                }`}
              />
            </div>

            {surpriseMe && (
              <p className="mt-2 text-xs font-medium text-primary">
                ✨ We&apos;ll find a destination based on your budget, days and
                interests.
              </p>
            )}
          </div>

          {/* Duration + Budget */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Days */}
            <div>
              <div className="mb-2.5 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  How long is the adventure?
                </span>
              </div>

              <div className="flex h-14 items-center justify-between rounded-2xl border border-border/70 bg-white/80 px-3">
                <button
                  type="button"
                  onClick={decreaseDays}
                  disabled={days <= 1}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-secondary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease trip length"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <div className="text-center">
                  <p className="text-lg font-extrabold text-foreground">
                    {days}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {days === 1 ? "day" : "days"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={increaseDays}
                  disabled={days >= 21}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-secondary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Increase trip length"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Budget */}
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    What&apos;s your budget?
                  </span>
                </div>

                <span className="text-sm font-extrabold text-primary">
                  ₹{budget.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="rounded-2xl border border-border/70 bg-white/80 p-4">
                <input
                  type="range"
                  min={5000}
                  max={50000}
                  step={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-primary"
                  aria-label="Trip budget"
                />

                <div className="mt-2 flex justify-between text-[10px] font-medium text-muted-foreground">
                  <span>₹5K</span>
                  <span>₹25K</span>
                  <span>₹50K</span>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="exactBudget"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Or enter exact amount
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      ₹
                    </span>

                    <input
                      id="exactBudget"
                      type="number"
                      min={1000}
                      step={500}
                      value={budget}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (value >= 1000 && value <= 1000000) {
                          setBudget(value);
                        }
                      }}
                      className="h-11 w-full rounded-xl border border-border/70 bg-background pl-8 pr-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Travel style */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                What&apos;s your travel vibe?
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {TRAVEL_STYLES.map((style) => {
                const active = travelStyle === style.value;

                return (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => setTravelStyle(style.value)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                        : "border-border/70 bg-white/60 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white"
                    }`}
                  >
                    <div className="mb-2 text-xl">{style.emoji}</div>

                    <p
                      className={`text-sm font-bold ${
                        active ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {style.label}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-foreground">
                What are you into?
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pick everything that sounds like you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {INTEREST_OPTIONS.map((interest) => {
                const Icon = interest.icon;
                const active = interests.includes(interest.value);

                return (
                  <button
                    key={interest.value}
                    type="button"
                    onClick={() => toggleInterest(interest.value)}
                    className={`group rounded-2xl border p-3.5 text-left transition-all ${
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "border-border/70 bg-white/60 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white"
                    }`}
                  >
                    <Icon
                      className={`mb-2 h-5 w-5 transition-transform group-hover:scale-110 ${
                        active ? "text-primary-foreground" : "text-primary"
                      }`}
                    />

                    <p className="text-xs font-semibold">{interest.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={
              isLoading ||
              !startLocation.trim() ||
              (!destination.trim() && !surpriseMe)
            }
            className="group h-14 w-full gap-2 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Crafting your journey...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Build My Trip
              </>
            )}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            ✨ Your itinerary is generated around your preferences and budget.
          </p>
        </div>
      </div>
    </form>
  );
}
