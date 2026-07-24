'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gem, Check, Plus } from 'lucide-react'
import { Reveal } from './reveal'

const explorers = [
  { name: 'Ananya Rawat', level: 'Trailblazer', trips: 128, followers: '24.1k', gems: 37, avatar: '/images/avatar-1.png' },
  { name: 'Kabir Sethi', level: 'Pathfinder', trips: 96, followers: '18.7k', gems: 29, avatar: '/images/avatar-2.png' },
  { name: 'Meera Joshi', level: 'Summit Guide', trips: 154, followers: '31.4k', gems: 52, avatar: '/images/avatar-3.png' },
  { name: 'Rohan Thapa', level: 'Wayfarer', trips: 74, followers: '12.9k', gems: 21, avatar: '/images/avatar-4.png' },
]

function FollowButton() {
  const [following, setFollowing] = useState(false)
  return (
    <button
      onClick={() => setFollowing((f) => !f)}
      className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
        following
          ? 'bg-secondary text-foreground'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
      }`}
    >
      {following ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {following ? 'Following' : 'Follow'}
    </button>
  )
}

export function TopExplorers() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Top Explorers
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
            The people lighting the trail
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {explorers.map((e, i) => (
            <motion.article
              key={e.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center rounded-3xl border border-border/70 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative">
                <img
                  src={e.avatar || '/placeholder.svg'}
                  alt={e.name}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-secondary"
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gem px-2.5 py-0.5 text-[11px] font-semibold text-gem-foreground shadow">
                  {e.level}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-foreground">{e.name}</h3>

              <div className="mt-4 grid w-full grid-cols-3 gap-1 rounded-2xl bg-secondary/70 py-3">
                <div>
                  <p className="font-display text-base font-bold text-foreground">{e.trips}</p>
                  <p className="text-[11px] text-muted-foreground">Trips</p>
                </div>
                <div className="border-x border-border">
                  <p className="font-display text-base font-bold text-foreground">{e.followers}</p>
                  <p className="text-[11px] text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="inline-flex items-center gap-1 font-display text-base font-bold text-gem">
                    <Gem className="h-3.5 w-3.5" />
                    {e.gems}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Gems</p>
                </div>
              </div>

              <div className="mt-4 w-full">
                <FollowButton />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
