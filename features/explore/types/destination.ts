
export type Destination = {
  id: string
  name: string
  state: string
  country?: string
  category: string
  description: string
  image: string

  // Our curated data
  rating: number
  duration: string
  budget: number
  difficulty: "Easy" | "Moderate" | "Hard"
  hiddenGem: boolean
  bestSeason?: string

  // Google Places data
  googlePlaceId?: string
  googleRating?: number
  googleReviewCount?: number
  latitude?: number
  longitude?: number
  googlePhotoName?: string
}
