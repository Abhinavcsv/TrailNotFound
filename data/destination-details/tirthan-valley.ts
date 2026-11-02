
import type { DestinationDetails } from "@/features/explore/types/destination-details";

export const tirthanValleyDetails: DestinationDetails = {
  destinationId: "tirthan-valley",

  overview: {
    introduction:
      "Tucked away in the Banjar region of Kullu district, Tirthan Valley is a peaceful Himalayan destination shaped by the Tirthan River, forested slopes and traditional mountain villages. It is known for riverside stays, nature walks and its proximity to the Great Himalayan National Park. Unlike crowded hill stations, the valley offers a slower experience centred around nature and local life.",

    highlights: [
      "Riverside landscapes and quiet village surroundings",
      "Access to the Great Himalayan National Park region",
      "Traditional Himachali villages and homestays",
      "Forest walks, mountain views and nature experiences",
      "Local food and trout-fishing heritage",
      "Nearby Banjar, Gushaini and Nagini settlements",
    ],

    bestFor: [
      "Nature lovers",
      "Families and relaxed travellers",
      "Photography enthusiasts",
      "Village and culture experiences",
      "People interested in guided nature walks",
    ],
  },

  attractions: [
    {
      name: "Gushaini",
      description:
        "One of the main settlements in the inner Tirthan Valley. Gushaini is a convenient base for exploring the riverside, nearby villages and the Great Himalayan National Park region.",
    },
    {
      name: "Nagini",
      description:
        "A peaceful village area along the Tirthan River, known for its homestays and access to the surrounding natural landscape.",
    },
    {
      name: "Sai Ropa",
      description:
        "An important access point for visitors interested in the Great Himalayan National Park. The park's visitor and permit facilities are located in this area.",
    },
    {
      name: "Great Himalayan National Park",
      description:
        "A UNESCO World Heritage Site recognised for its Himalayan biodiversity, forests and mountain ecosystems. Access to the protected core is regulated and requires following park entry rules.",
    },
    {
      name: "Jalori Pass",
      description:
        "A high mountain pass in the wider Banjar region, offering forested mountain scenery. Road access can be affected by snow and weather conditions.",
    },
    {
      name: "Serolsar Lake",
      description:
        "A mountain lake reached by a walking trail from the Jalori Pass area. Check local trail and weather conditions before planning a visit.",
    },
  ],

  activities: [
    {
      name: "Riverside walks",
      description:
        "Spend time around accessible stretches of the Tirthan River, enjoy the scenery and explore the village surroundings while respecting local property and river safety.",
      duration: "1–2 hours",
    },
    {
      name: "Village exploration",
      description:
        "Explore settlements such as Gushaini, Nagini and Banjar to experience local architecture, everyday life and the slower pace of the valley.",
      duration: "2–3 hours",
    },
    {
      name: "Nature and bird watching",
      description:
        "Observe the valley's forest landscape and birdlife. A local naturalist can help identify species and explain the area's ecology.",
      duration: "2–3 hours",
    },
    {
      name: "Guided nature walks",
      description:
        "Explore suitable local trails with a knowledgeable local guide. Choose routes according to weather, fitness and current trail conditions.",
      duration: "Varies by route",
    },
    {
      name: "Local food experiences",
      description:
        "Try Himachali meals and locally prepared dishes at homestays and eateries. Ask hosts about seasonal and regional specialities.",
      duration: "1–2 hours",
    },
    {
      name: "Jalori Pass and Serolsar Lake visit",
      description:
        "Explore the wider Banjar region with a planned visit to Jalori Pass and its walking trails. Check road access, weather and trail conditions before setting out.",
      duration: "Half day or longer",
    },
  ],

  nearbyPlaces: [
    {
      name: "Banjar",
      description:
        "The main town in the region, useful for local shopping, basic supplies and onward transport.",
    },
    {
      name: "Jibhi",
      description:
        "A neighbouring mountain destination known for its village atmosphere, cafes and forest surroundings.",
    },
    {
      name: "Shoja",
      description:
        "A small mountain settlement on the route towards Jalori Pass, surrounded by forested slopes.",
    },
    {
      name: "Jalori Pass",
      description:
        "A scenic high-altitude pass connecting routes in the wider Banjar region. Seasonal road closures are possible.",
    },
    {
      name: "Serolsar Lake",
      description:
        "A lake reached by a forest walking trail from Jalori Pass. Plan the visit around local weather and trail advice.",
    },
  ],

  howToReach: {
    byRoad:
      "A common road route is via Chandigarh, Mandi and Aut, followed by the road towards Banjar and Gushaini. The final approach follows mountain roads, so allow extra time and check road conditions before travelling.",

    nearestRailwayStation:
      "Jogindernagar is a narrow-gauge railhead in the wider region. Chandigarh is another practical rail connection for many visitors, followed by onward road travel. Confirm current train services and onward transport before departure.",

    nearestAirport:
      "Bhuntar Airport near Kullu is the closest airport commonly used for this region. Flights and onward road connections can be limited or affected by weather, so verify availability before planning.",
  },

  accommodation: [
    "Family-run homestays around Gushaini and Nagini",
    "Guesthouses and small hotels around Banjar",
    "Cottage-style stays in the wider Jibhi and Shoja region",
    "Nature-oriented stays with views of the surrounding mountains",
  ],

  localFood: [
    "Traditional Himachali meals",
    "Siddu, a regional steamed bread",
    "Rajma and rice",
    "Seasonal local vegetables",
    "Locally prepared trout dishes where legally and responsibly available",
    "Simple home-cooked meals at family-run homestays",
  ],

  itinerary: [
    {
      day: 1,
      title: "Arrive and experience the valley",
      activities: [
        "Arrive in the Gushaini or Nagini area",
        "Check in and settle into your accommodation",
        "Explore an accessible riverside area",
        "Enjoy a local dinner and relax",
      ],
    },
    {
      day: 2,
      title: "Villages and nature",
      activities: [
        "Have breakfast at your homestay",
        "Explore nearby village surroundings",
        "Enjoy a guided nature or bird-watching walk",
        "Spend the afternoon experiencing local food and culture",
      ],
    },
    {
      day: 3,
      title: "Explore the wider Banjar region",
      activities: [
        "Plan a visit towards Jalori Pass if road and weather conditions permit",
        "Consider the Serolsar Lake walking trail only when conditions are suitable",
        "Return to your accommodation with enough daylight",
        "Keep the evening relaxed",
      ],
    },
    {
      day: 4,
      title: "Departure",
      activities: [
        "Enjoy breakfast and check out",
        "Explore Banjar if time permits",
        "Begin your return journey",
      ],
    },
  ],

  travelTips: [
    "Check road, weather and local transport conditions before travelling.",
    "Carry some cash because digital payment and ATM access can be inconsistent in smaller settlements.",
    "Mobile connectivity can vary between the main valley and remote villages.",
    "Pack layers because temperatures can change between daytime and evening.",
    "Respect private land, local customs and the natural environment.",
    "Carry reusable water bottles and take your waste back with you.",
    "Use local guidance for unfamiliar walking routes.",
    "Follow Great Himalayan National Park entry rules and obtain required permits before entering its protected core.",
    "Avoid planning mountain walks during poor weather or when local authorities advise against travel.",
    "Confirm accommodation, transport and activity costs directly before booking.",
  ],

  faqs: [
    {
      question: "Where is Tirthan Valley located?",
      answer:
        "Tirthan Valley is in the Banjar region of Kullu district, Himachal Pradesh, India.",
    },
    {
      question: "What is Tirthan Valley known for?",
      answer:
        "It is known for the Tirthan River, peaceful mountain villages, homestays, nature experiences and its proximity to the Great Himalayan National Park.",
    },
    {
      question: "How many days are enough for Tirthan Valley?",
      answer:
        "Three to four days can make a comfortable first visit, depending on your travel time and the places you want to explore.",
    },
    {
      question: "Can visitors explore the Great Himalayan National Park?",
      answer:
        "Yes, visitors can explore permitted areas. Entry into the protected core is regulated and requires the applicable permits and compliance with park rules.",
    },
    {
      question: "Is Tirthan Valley suitable for a relaxed holiday?",
      answer:
        "Yes. Visitors can enjoy village surroundings, riverside scenery, local food and nature experiences without planning a demanding trek.",
    },
    {
      question: "What should visitors check before travelling?",
      answer:
        "Check current weather, road access, accommodation availability, transport connections and any applicable park or trail restrictions.",
    },
  ],
};
