import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateItinerary, type PlannerInput } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<PlannerInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const startLocation = body.startLocation?.trim();
  const destination = body.destination?.trim();
  const endLocation = body.endLocation?.trim() || startLocation;
  const days = Number(body.days);
  const budget = Number(body.budget);
  const interests = Array.isArray(body.interests) ? body.interests : [];
  const travelStyle = body.travelStyle || "balanced";

  if (
    !startLocation ||
    !destination ||
    !endLocation ||
    !days ||
    days < 1 ||
    days > 21 ||
    !budget ||
    budget < 1
  ) {
    return NextResponse.json(
      {
        error:
          "Missing or invalid fields: startLocation, destination, days, budget are required",
      },
      { status: 400 }
    );
  }

  const input: PlannerInput = {
    startLocation,
    destination,
    endLocation,
    days,
    budget,
    interests,
    travelStyle,
  };

  try {
    const itinerary = await generateItinerary(input);

    const trip = await prisma.trip.create({
      data: {
        title: `${itinerary.destination} - ${days} Day Trip`,
        destination: itinerary.destination,
        budget,
        interests,
        itinerary: itinerary as unknown as object,
      },
    });

    await prisma.aIHistory.create({
      data: {
        userId: session.user.id,
        prompt: input as unknown as object,
        response: itinerary as unknown as object,
      },
    });

    return NextResponse.json({ tripId: trip.id, itinerary });
  } catch (err) {
    console.error("Planner generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate itinerary. Please try again." },
      { status: 500 }
    );
  }
}
