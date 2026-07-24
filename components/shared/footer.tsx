'use client'

import { Mountain, Camera, AtSign, Hash, Globe, ArrowRight } from 'lucide-react'

const columns = [
  {
    title: 'Explore',
    links: ['Destinations', 'Hidden Gems', 'Interests', 'Weekend Getaways', 'AI Planner'],
  },
  {
    title: 'Community',
    links: ['Travel Stories', 'Top Explorers', 'Join Trips', 'Guidelines', 'Events'],
  },
  {
    title: 'Resources',
    links: ['Travel Guides', 'Packing Lists', 'Safety', 'Help Center', 'Blog'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Press', 'Privacy', 'Terms'],
  },
]

const socials = [Camera, AtSign, Hash, Globe]

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <a href="#top" className="flex items-center gap-2 font-display text-xl font-extrabold">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary">
                <Mountain className="h-4 w-4" />
              </span>
              TrailNotFound
            </a>
            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-white/60">
              India&apos;s AI-powered travel community for explorers who chase stories,
              not checklists.
            </p>

            <div className="mt-8 max-w-sm">
              <p className="text-sm font-semibold text-white">Join the newsletter</p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-3 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 focus-within:border-white/40"
              >
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-white">{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} TrailNotFound. Made for explorers of India.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
