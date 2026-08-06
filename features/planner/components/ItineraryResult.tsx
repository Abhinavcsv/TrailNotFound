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
      <Card>
        <CardHeader>
          <CardTitle>{itinerary.destination}</CardTitle>
          <CardDescription>{itinerary.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">
            Estimated total cost:{" "}
            <span className="text-primary">{formatINR(itinerary.totalEstimatedCost)}</span>
          </p>
        </CardContent>
      </Card>

      {itinerary.days.map((day) => (
        <Card key={day.day}>
          <CardHeader>
            <CardTitle>
              Day {day.day}: {day.title}
            </CardTitle>
            <CardDescription>Estimated cost: {formatINR(day.estimatedCost)}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              {day.activities.map((activity, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-16 shrink-0 text-xs font-medium text-muted-foreground">
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
        <Card>
          <CardHeader>
            <CardTitle>Travel tips</CardTitle>
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
