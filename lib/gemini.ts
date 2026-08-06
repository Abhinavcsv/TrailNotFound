import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export interface PlannerInput {
  startLocation: string;
  destination: string;
  endLocation: string;
  days: number;
  budget: number;
  interests: string[];
  travelStyle: string;
}

export interface ItineraryDayActivity {
  time: string;
  title: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryDayActivity[];
  estimatedCost: number;
}

export interface ItineraryResponse {
  destination: string;
  summary: string;
  days: ItineraryDay[];
  totalEstimatedCost: number;
  travelTips: string[];
}

function buildPrompt(input: PlannerInput): string {
  return `You are a travel planning assistant. A user wants a detailed day-by-day itinerary.

CRITICAL ACCURACY RULES:
- First, correctly identify the real-world country and region of "${input.destination}". Do NOT assume it is in India unless it actually is. If the destination is a well-known trek or place located outside India (e.g. Annapurna Base Camp / ABC Trek is in Nepal), use the CORRECT country's geography, culture, food, and logistics.
- Only reference real, verifiable place names (viewpoints, villages, landmarks, trailheads). NEVER invent a fictional-sounding place name. If you are not certain of a specific landmark's real name, describe it generically (e.g. "a ridge viewpoint along the trail") instead of making up a proper noun.
- Base logistics (nearest towns, transport, permits, altitude, typical costs) on how this trip is actually done in reality.
- Include realistic travel/transit details for getting from "${input.startLocation}" to "${input.destination}", and from "${input.destination}" back to "${input.endLocation}" (flights, trains, buses, shared taxis, etc. as appropriate for the real route) as part of Day 1 and the final day's activities.

Generate the itinerary in STRICT JSON format (no markdown, no code fences, just raw JSON) matching this exact TypeScript shape:

{
  "destination": string, // include the correct country if it's outside India
  "summary": string, // 2-3 sentence overview of the trip, mentioning the route from start to end
  "days": [
    {
      "day": number,
      "title": string, // short theme for the day, e.g. "Arrival & Local Exploration"
      "activities": [
        { "time": string, "title": string, "description": string }
      ],
      "estimatedCost": number // in INR for that day
    }
  ],
  "totalEstimatedCost": number, // in INR, including transit between start/destination/end
  "travelTips": string[] // 3-5 practical tips specific to this real destination and route
}

Trip details:
- Starting from: ${input.startLocation}
- Destination: ${input.destination}
- Ending at: ${input.endLocation}
- Duration: ${input.days} days
- Budget: INR ${input.budget} total
- Interests: ${input.interests.join(", ") || "general sightseeing"}
- Travel style: ${input.travelStyle}

Keep activities realistic and budget-aware, grounded in how this trip is actually done. Return ONLY the JSON object, nothing else.`;
}

export async function generateItinerary(
  input: PlannerInput
): Promise<ItineraryResponse> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(buildPrompt(input));
  const text = result.response.text();

  let parsed: ItineraryResponse;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Failed to parse itinerary response from AI");
  }

  return parsed;
}
