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

export interface PlannerFormValues {
  startLocation: string;
  destination: string;
  endLocation: string;
  days: number;
  budget: number;
  interests: string[];
  travelStyle: string;
}