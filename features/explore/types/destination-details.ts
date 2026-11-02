
export type DestinationDetails = {
  destinationId: string;

  overview: {
    introduction: string;
    highlights: string[];
    bestFor: string[];
  };

  attractions: {
    name: string;
    description: string;
    image?: string;
  }[];

  activities: {
    name: string;
    description: string;
    duration?: string;
  }[];

  nearbyPlaces: {
    name: string;
    description: string;
  }[];

  howToReach: {
    byRoad: string;
    nearestRailwayStation: string;
    nearestAirport: string;
  };

  accommodation: string[];
  localFood: string[];

  itinerary: {
    day: number;
    title: string;
    activities: string[];
  }[];

  travelTips: string[];

  faqs: {
    question: string;
    answer: string;
  }[];
};
