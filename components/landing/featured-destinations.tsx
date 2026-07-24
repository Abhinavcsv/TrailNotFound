'use client'

import { motion } from 'framer-motion'
import { Star, Bookmark, ArrowUpRight } from 'lucide-react'
import { Reveal } from './reveal'

const destinations = [
  { name: 'Tirthan Valley', state: 'Himachal Pradesh', rating: 4.9, saved: '3.2k', img: '/images/dest-tirthan.png' },
  { name: 'Ziro Valley', state: 'Arunachal Pradesh', rating: 4.8, saved: '2.1k', img: '/images/dest-ziro.png' },
  { name: 'Spiti', state: 'Himachal Pradesh', rating: 4.9, saved: '5.7k', img: '/images/dest-spiti.png' },
  { name: 'Chopta', state: 'Uttarakhand', rating: 4.7, saved: '1.9k', img: '/images/dest-chopta.png' },
  { name: 'Munsiyari', state: 'Uttarakhand', rating: 4.8, saved: '1.4k', img: '/images/dest-munsiyari.png' },
]

export function FeaturedDestinations() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Featured Destinations
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
              Places explorers keep coming back to
            </h2>
          </div>
          <button className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary">
            View all destinations
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>

      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 no-scrollbar md:px-8">
        {destinations.map((d, i) => (
          <motion.article
            key={d.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-xl sm:w-[46vw] lg:w-[24rem]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={d.img || '/placeholder.svg'}
                alt={`${d.name}, ${d.state}`}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <button
                aria-label={`Save ${d.name}`}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/35"
              >
                <Bookmark className="h-[18px] w-[18px]" />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-2xl font-bold text-white">{d.name}</h3>
                <p className="text-sm text-white/75">{d.state}</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Star className="h-4 w-4 fill-accent text-accent" />
                {d.rating}
                <span className="font-normal text-muted-foreground">community</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Bookmark className="h-4 w-4" />
                {d.saved} saved
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
