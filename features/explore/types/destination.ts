export interface Destination {
  id: string
  name: string
  state: string
  category: string
  difficulty: "Easy" | "Moderate" | "Hard"
  budget: number
  duration: string
  bestSeason: string
  rating: number
  image: string
  description: string
  hiddenGem: boolean
}