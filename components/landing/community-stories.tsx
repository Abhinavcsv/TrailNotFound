
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react'
import { Reveal } from './reveal'

const stories = [
  {
    title: 'Chasing sunrise above the clouds in Chopta',
    author: 'Ananya R.',
    avatar: '/images/avatar-1.png',
    img: '/images/story-1.png',
    category: 'Mountain Stories',
  },
  {
    title: 'The little café where I lost track of time',
    author: 'Kabir S.',
    avatar: '/images/avatar-2.png',
    img: '/images/story-2.png',
    category: 'Local Experiences',
  },
  {
    title: 'Prayer flags & thin air: 10 days in Ladakh',
    author: 'Meera J.',
    avatar: '/images/avatar-3.png',
    img: '/images/story-3.png',
    category: 'Travel Diaries',
  },
  {
    title: 'A night under a billion stars in Spiti',
    author: 'Rohan T.',
    avatar: '/images/avatar-4.png',
    img: '/images/story-4.png',
    category: 'Adventure',
  },
  {
    title: 'Slow mornings in a Himalayan village market',
    author: 'Ananya R.',
    avatar: '/images/avatar-1.png',
    img: '/images/story-5.png',
    category: 'Culture',
  },
  {
    title: 'The road that changed how I travel',
    author: 'Kabir S.',
    avatar: '/images/avatar-2.png',
    img: '/images/story-6.png',
    category: 'Road Trips',
  },
]

export function CommunityStories() {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        {/* Section heading */}
        <Reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Stories from the community
            </p>

            <h2 className="font-display text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Real journeys, told by real explorers
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Get inspired by travel diaries, memorable experiences,
              and stories shared by fellow travellers.
            </p>
          </div>

          <Link
            href="/community"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Explore community
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        {/* Story cards */}
        <div className="gap-5 sm:columns-2 lg:columns-3">
          {stories.map((story, index) => (
            <motion.article
              key={story.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: (index % 3) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group mb-5 block break-inside-avoid overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Story image */}
              <Link
                href="/stories"
                aria-label={`Read story: ${story.title}`}
                className="relative block overflow-hidden"
              >
                <img
                  src={story.img}
                  alt={story.title}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    index % 3 === 0
                      ? 'aspect-[3/4]'
                      : index % 3 === 1
                        ? 'aspect-square'
                        : 'aspect-[4/5]'
                  }`}
                />

                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-lg">
                  {story.category}
                </span>
              </Link>

              {/* Story content */}
              <div className="p-5">
                <div className="mb-4 flex items-center gap-2.5">
                  <img
                    src={story.avatar}
                    alt=""
                    loading="lazy"
                    className="h-9 w-9 rounded-full border border-border object-cover"
                  />

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {story.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Community explorer
                    </p>
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold leading-snug text-foreground">
                  {story.title}
                </h3>

                <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="h-4 w-4" />
                      Stories
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" />
                      Experiences
                    </span>
                  </div>

                  <Link
                    href="/stories"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/75"
                  >
                    Read
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <Reveal className="mt-12 flex flex-col items-center text-center">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </span>

          <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            Have a story worth sharing?
          </h3>

          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Share your journeys, recommendations, and experiences
            with the TrailNotFound community.
          </p>

          <Link
            href="/community"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Share your story
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

      </div>
    </section>
  )
}
