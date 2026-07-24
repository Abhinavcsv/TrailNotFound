'use client'

import { motion } from 'framer-motion'
import { Heart, MessageCircle } from 'lucide-react'
import { Reveal } from './reveal'

const stories = [
  { title: 'Chasing sunrise above the clouds in Chopta', author: 'Ananya R.', avatar: '/images/avatar-1.png', likes: '2.4k', comments: 182, img: '/images/story-1.png' },
  { title: 'The little café where I lost track of time', author: 'Kabir S.', avatar: '/images/avatar-2.png', likes: '1.1k', comments: 96, img: '/images/story-2.png' },
  { title: 'Prayer flags & thin air: 10 days in Ladakh', author: 'Meera J.', avatar: '/images/avatar-3.png', likes: '3.7k', comments: 240, img: '/images/story-3.png' },
  { title: 'A night under a billion stars in Spiti', author: 'Rohan T.', avatar: '/images/avatar-4.png', likes: '4.2k', comments: 311, img: '/images/story-4.png' },
  { title: 'Slow mornings in a Himalayan village market', author: 'Ananya R.', avatar: '/images/avatar-1.png', likes: '890', comments: 54, img: '/images/story-5.png' },
  { title: 'The road that changed how I travel', author: 'Kabir S.', avatar: '/images/avatar-2.png', likes: '1.9k', comments: 128, img: '/images/story-6.png' },
]

export function CommunityStories() {
  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Community Stories
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
            Real journeys, told by real explorers
          </h2>
        </Reveal>

        <div className="[column-fill:_balance] gap-5 sm:columns-2 lg:columns-3">
          {stories.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group mb-5 block break-inside-avoid overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={s.img || '/placeholder.svg'}
                  alt={s.title}
                  className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                    i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]'
                  }`}
                />
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2.5">
                  <img
                    src={s.avatar || '/placeholder.svg'}
                    alt={s.author}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-muted-foreground">{s.author}</span>
                </div>
                <h3 className="font-display text-lg font-bold leading-snug text-foreground text-balance">
                  {s.title}
                </h3>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="h-4 w-4 text-accent" />
                      {s.likes}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" />
                      {s.comments}
                    </span>
                  </div>
                  <button className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                    Read Story
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
