"use client"

import { motion } from "framer-motion"
import { Star, Bookmark, Sparkles, IndianRupee, CalendarDays, Gauge } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Destination } from "../types/destination"

const DIFFICULTY_STYLES: Record<Destination["difficulty"], string> = {
  Easy: "bg-gem/10 text-gem",
  Moderate: "bg-accent/10 text-accent",
  Hard: "bg-destructive/10 text-destructive",
}

export function DestinationCard({
  destination,
  index = 0,
}: {
  destination: Destination
  index?: number
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-xl"
    >
      <Link href={`/destination/${destination.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={destination.image || "/placeholder.svg"}
            alt={`${destination.name}, ${destination.state}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
            {destination.hiddenGem ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gem px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                <Sparkles className="h-3 w-3" />
                Hidden Gem
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                {destination.category}
              </span>
            )}

            <button
              aria-label={`Save ${destination.name}`}
              onClick={(e) => e.preventDefault()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/35"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-xl font-bold text-white">{destination.name}</h3>
            <p className="text-sm text-white/75">{destination.state}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4">
          <p className="line-clamp-2 text-sm text-muted-foreground">{destination.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              {destination.rating}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {destination.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <IndianRupee className="h-3.5 w-3.5" />
              {destination.budget
                ? `₹${destination.budget.toLocaleString("en-IN")}`
                : "Budget not available"}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${DIFFICULTY_STYLES[destination.difficulty]}`}
            >
              <Gauge className="h-3 w-3" />
              {destination.difficulty}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}