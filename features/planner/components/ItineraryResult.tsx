import { MapPin, Wallet, Clock, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ItineraryResponse } from "../types/itinerary";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ItineraryResult({ itinerary }: { itinerary: ItineraryResponse }) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-3xl border border-white/60 bg-white/60 shadow-xl shadow-primary/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-2xl font-bold">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-gem text-white">
              <MapPin className="h-4 w-4" />
            </span>
            {itinerary.destination}
          </CardTitle>
          <CardDescription>{itinerary.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Wallet className="h-4 w-4" />
            {formatINR(itinerary.totalEstimatedCost)} estimated total
          </p>
        </CardContent>
      </Card>

      {itinerary.days.map((day) => (
        <Card key={day.day} className="rounded-3xl border border-white/60 bg-white/60 shadow-xl shadow-primary/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-display text-lg font-bold">
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                {day.day}
              </span>
              {day.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5" />
              Estimated cost: {formatINR(day.estimatedCost)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              {day.activities.map((activity, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex w-16 shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      {itinerary.travelTips.length > 0 && (
        <Card className="rounded-3xl border border-gem/30 bg-gem/10 shadow-xl shadow-gem/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gem text-white">
                <Lightbulb className="h-4 w-4" />
              </span>
              Travel tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-muted-foreground [&>li]:mt-1">
              {itinerary.travelTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
