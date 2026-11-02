
"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { destinations } from "@/data/destinations"
import {
  Search,
  Check,
  X,
  Download,
  RotateCcw,
} from "lucide-react"

type Decision = "keep" | "replace"

export default function ImageReviewPage() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({})
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")

  const filtered = useMemo(() => {
    return destinations.filter((destination) => {
      const matchesSearch =
        destination.name.toLowerCase().includes(query.toLowerCase()) ||
        destination.state.toLowerCase().includes(query.toLowerCase())

      const decision = decisions[destination.id]

      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && !decision) ||
        decision === filter

      return matchesSearch && matchesFilter
    })
  }, [query, filter, decisions])

  const keepCount = Object.values(decisions).filter(
    (value) => value === "keep"
  ).length

  const replaceCount = Object.values(decisions).filter(
    (value) => value === "replace"
  ).length

  const pendingCount = destinations.length - keepCount - replaceCount

  function exportReview() {
    const review = {
      exportedAt: new Date().toISOString(),
      total: destinations.length,
      keep: keepCount,
      replace: replaceCount,
      pending: pendingCount,
      decisions: destinations.map((destination) => ({
        id: destination.id,
        name: destination.name,
        image: destination.image,
        decision: decisions[destination.id] || "pending",
      })),
    }

    const blob = new Blob(
      [JSON.stringify(review, null, 2)],
      { type: "application/json" }
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "trailnotfound-image-review.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  function resetReview() {
    setDecisions({})
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            TrailNotFound · Admin
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Destination Image Review
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Review every destination image. Keep accurate images and mark
            mismatched ones for replacement.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Total", value: destinations.length },
            { label: "Keep", value: keepCount },
            { label: "Replace", value: replaceCount },
            { label: "Pending", value: pendingCount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search destination or state..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
          >
            <option value="all">All destinations</option>
            <option value="pending">Pending review</option>
            <option value="keep">Keep selected</option>
            <option value="replace">Replace selected</option>
          </select>

          <button
            onClick={exportReview}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <Download size={16} />
            Export JSON
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((destination) => {
            const decision = decisions[destination.id]

            return (
              <article
                key={destination.id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                    {decision === "keep"
                      ? "Keep"
                      : decision === "replace"
                        ? "Replace"
                        : "Pending"}
                  </span>
                </div>

                <div className="p-4">
                  <h2 className="font-semibold">{destination.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {destination.state}
                  </p>
                  <p className="mt-2 break-all text-xs text-muted-foreground">
                    {destination.image}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        setDecisions((current) => ({
                          ...current,
                          [destination.id]: "keep",
                        }))
                      }
                      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold ${
                        decision === "keep"
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <Check size={16} />
                      Keep
                    </button>

                    <button
                      onClick={() =>
                        setDecisions((current) => ({
                          ...current,
                          [destination.id]: "replace",
                        }))
                      }
                      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold ${
                        decision === "replace"
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <X size={16} />
                      Replace
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            No destinations found.
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {keepCount + replaceCount} of {destinations.length} reviewed
          </p>

          <button
            onClick={resetReview}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            <RotateCcw size={15} />
            Reset review
          </button>
        </div>
      </div>
    </main>
  )
}
