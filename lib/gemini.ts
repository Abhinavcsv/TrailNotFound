import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const genAI = new GoogleGenerativeAI(apiKey);

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

export interface BudgetBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
}

export interface HiddenGem {
  name: string;
  location: string;
  description: string;
  whyVisit: string;
}

export interface ItineraryResponse {
  destination: string;
  summary: string;

  budget: number;
  totalEstimatedCost: number;

  budgetBreakdown: BudgetBreakdown;

  days: ItineraryDay[];

  hiddenGems: HiddenGem[];

  travelTips: string[];
}

function buildPrompt(input: PlannerInput): string {
  const isSurpriseMe =
    !input.destination.trim() ||
    input.destination.trim().toLowerCase() === "surprise me";

  const destinationInstruction = isSurpriseMe
    ? `
The traveler has not selected a destination.

Choose ONE specific, real travel destination that fits:
- Starting location: ${input.startLocation}
- Budget: INR ${input.budget}
- Duration: ${input.days} days
- Interests: ${input.interests.join(", ") || "general sightseeing"}
- Travel style: ${input.travelStyle}

The destination must realistically fit the traveler's budget and duration.
Never return "Surprise me" as the destination.
`
    : `
The traveler selected: "${input.destination}".

Identify the real-world location correctly.
Do not assume the destination is in India unless it actually is.

For example:
- Annapurna Base Camp is in Nepal.
- Bali is in Indonesia.
- Bhutan is a separate country.

Use the correct geography, culture, transport, food and local context.
`;

  return `
You are TrailNotFound's AI travel planner.

Your job is to create a realistic, useful and budget-aware travel itinerary for an Indian traveler.

${destinationInstruction}

IMPORTANT ACCURACY RULES:

1. ONLY use real places and real destinations.
2. Never invent landmarks, villages, viewpoints, restaurants or attractions.
3. If you are unsure about the exact name of a small attraction, describe it generically instead of inventing a proper noun.
4. Respect the requested number of days EXACTLY.
5. Include realistic travel time and transportation.
6. Consider the starting location and ending location.
7. The itinerary should feel physically possible. Do not pack unrealistic numbers of activities into one day.
8. Consider opening/closing times where relevant.
9. Consider altitude, weather and road conditions where relevant.
10. Consider permits or entry requirements where they are commonly required.
11. Use INR for every cost.
12. Costs should be realistic estimates, not random numbers.
13. Do not recommend luxury experiences when the selected travel style is budget.
14. Do not exceed the user's budget without a very strong reason.
15. Prefer staying within 90-100% of the requested budget.
16. If the requested budget is unusually low for the destination, simplify the itinerary rather than pretending the trip can realistically be completed within that amount.
17. Do not count the same expense twice.

TRIP INFORMATION:

Starting location:
${input.startLocation}

Destination:
${isSurpriseMe ? "Choose a suitable destination" : input.destination}

Ending location:
${input.endLocation}

Duration:
${input.days} days

Maximum budget:
INR ${input.budget}

Interests:
${input.interests.join(", ") || "General sightseeing"}

Travel style:
${input.travelStyle}

BUDGET RULE:

The total estimated cost must be calculated from:

transport
+ accommodation
+ food
+ activities
+ miscellaneous

The sum of those five categories MUST equal totalEstimatedCost.

Try to keep totalEstimatedCost at or below INR ${input.budget}.

If transport from the starting location is expensive, reduce accommodation/activity costs instead of ignoring the transport cost.

DAY COST RULE:

The sum of all daily estimatedCost values should approximately represent the trip's total spending.

Do not create impossible daily costs.

ITINERARY QUALITY:

Each day should have a clear purpose.

For example:

Day 1:
Arrival + check-in + light exploration

Day 2:
Main sightseeing / trekking / activities

Day 3:
Local exploration / hidden gem

Final day:
Departure / return journey

Adapt this structure to the actual destination.

ACTIVITY QUALITY:

Each activity must contain:

- realistic time
- activity title
- useful description
- realistic sequencing

Descriptions should explain what the traveler actually does.

Avoid generic descriptions such as:
"Enjoy the beautiful scenery."

Instead explain something useful such as:
"Walk the forest trail to the viewpoint and keep 30–45 minutes for photography before returning to the village."

HIDDEN GEMS:

Suggest 2-4 lesser-known but REAL places or experiences relevant to the destination.

Do not invent hidden gems.

For each hidden gem provide:
- name
- location
- description
- whyVisit

TRAVEL TIPS:

Provide 4-6 practical destination-specific tips.

Include relevant information such as:
- transportation
- weather
- permits
- altitude
- cash/ATMs
- local transport
- safety
- clothing
- booking considerations

Do not provide generic filler.

STRICT OUTPUT FORMAT:

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not add explanations before or after the JSON.

The JSON MUST exactly follow this structure:

{
  "destination": "string",
  "summary": "2-3 sentence summary mentioning the route",

  "budget": ${input.budget},

  "totalEstimatedCost": 0,

  "budgetBreakdown": {
    "transport": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "miscellaneous": 0
  },

  "days": [
    {
      "day": 1,
      "title": "string",
      "activities": [
        {
          "time": "string",
          "title": "string",
          "description": "string"
        }
      ],
      "estimatedCost": 0
    }
  ],

  "hiddenGems": [
    {
      "name": "string",
      "location": "string",
      "description": "string",
      "whyVisit": "string"
    }
  ],

  "travelTips": [
    "string"
  ]
}

VALIDATION REQUIREMENTS:

- days array MUST contain exactly ${input.days} items.
- Day numbers MUST be sequential: 1, 2, 3... ${input.days}.
- budget MUST equal ${input.budget}.
- All costs MUST be numbers.
- All costs MUST be non-negative.
- budgetBreakdown MUST contain exactly five categories.
- totalEstimatedCost MUST equal the sum of the five budgetBreakdown categories.
- hiddenGems should contain 2-4 items.
- travelTips should contain 4-6 items.
- activities should contain realistic numbers of activities per day.
`;
}

function validateItinerary(
  itinerary: ItineraryResponse,
  input: PlannerInput
): void {
  if (!itinerary || typeof itinerary !== "object") {
    throw new Error("AI returned an invalid itinerary");
  }

  if (!itinerary.destination || typeof itinerary.destination !== "string") {
    throw new Error("AI returned an invalid destination");
  }

  if (!Array.isArray(itinerary.days)) {
    throw new Error("AI returned an invalid days array");
  }

  if (itinerary.days.length !== input.days) {
    throw new Error(
      `AI returned ${itinerary.days.length} days instead of ${input.days}`
    );
  }

  if (itinerary.budget !== input.budget) {
    itinerary.budget = input.budget;
  }

  if (
    !itinerary.budgetBreakdown ||
    typeof itinerary.budgetBreakdown !== "object"
  ) {
    throw new Error("AI returned an invalid budget breakdown");
  }

  const breakdown = itinerary.budgetBreakdown;

  const breakdownTotal =
    breakdown.transport +
    breakdown.accommodation +
    breakdown.food +
    breakdown.activities +
    breakdown.miscellaneous;

  if (
    !Number.isFinite(breakdown.transport) ||
    !Number.isFinite(breakdown.accommodation) ||
    !Number.isFinite(breakdown.food) ||
    !Number.isFinite(breakdown.activities) ||
    !Number.isFinite(breakdown.miscellaneous)
  ) {
    throw new Error("AI returned invalid budget values");
  }

  itinerary.totalEstimatedCost = breakdownTotal;

  itinerary.days.forEach((day, index) => {
    if (day.day !== index + 1) {
      throw new Error("AI returned invalid day numbering");
    }

    if (!day.title || !Array.isArray(day.activities)) {
      throw new Error(`AI returned invalid data for day ${index + 1}`);
    }

    if (!Number.isFinite(day.estimatedCost) || day.estimatedCost < 0) {
      throw new Error(`AI returned invalid cost for day ${index + 1}`);
    }

    day.activities.forEach((activity) => {
      if (
        !activity.time ||
        !activity.title ||
        !activity.description
      ) {
        throw new Error(`AI returned an invalid activity on day ${index + 1}`);
      }
    });
  });

  if (!Array.isArray(itinerary.hiddenGems)) {
    itinerary.hiddenGems = [];
  }

  if (!Array.isArray(itinerary.travelTips)) {
    itinerary.travelTips = [];
  }
}

export async function generateItinerary(
  input: PlannerInput
): Promise<ItineraryResponse> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.35,
    },
  });

  const result = await model.generateContent(buildPrompt(input));

  const text = result.response.text();

  if (!text.trim()) {
    throw new Error("AI returned an empty response");
  }

  let parsed: ItineraryResponse;

  try {
    parsed = JSON.parse(text) as ItineraryResponse;
  } catch {
    console.error("Invalid Gemini JSON:", text);
    throw new Error("Failed to parse itinerary response from AI");
  }

  validateItinerary(parsed, input);

  return parsed;
}