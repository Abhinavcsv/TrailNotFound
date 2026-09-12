export type Destination = {
  id: string
  name: string
  state: string
  category: string
  description: string
  image: string
  rating: number
  duration: string
  budget: number
  difficulty: "Easy" | "Moderate" | "Hard"
  hiddenGem: boolean
}