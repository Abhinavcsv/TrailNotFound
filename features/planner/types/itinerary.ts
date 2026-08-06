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

export interface PlannerFormValues {
  startLocation: string;
  destination: string;
  endLocation: string;
  days: number;
  budget: number;
  interests: string[];
  travelStyle: string;
}
