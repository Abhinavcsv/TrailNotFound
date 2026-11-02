
'use client'

import Link from 'next/link'
import {
  Mountain,
  Camera,
  BriefcaseBusiness,
  Play,
  Mail,
  ArrowUpRight,
} from 'lucide-react'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Destinations', href: '/explore' },
      { label: 'Hidden Gems', href: '/hidden-gems' },
      { label: 'Interests', href: '/explore' },
      { label: 'Weekend Getaways', href: '/explore' },
      { label: 'AI Planner', href: '/planner' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Travel Stories', href: '/stories' },
      { label: 'Top Explorers', href: '/community' },
      { label: 'Community', href: '/community' },
      { label: 'Guidelines', href: '/community' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Travel Guides', href: '/explore' },
      { label: 'Packing Lists', href: '/explore' },
      { label: 'Travel Safety', href: '/explore' },
      { label: 'Help Center', href: 'mailto:hello@trailnotfound.com' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: 'mailto:hello@trailnotfound.com' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
]

const socials = [
  {
    label: 'Photo updates',
    icon: Camera,
    href: null,
  },
  {
    label: 'Professional updates',
    icon: BriefcaseBusiness,
    href: null,
  },
  {
    label: 'Video updates',
    icon: Play,
    href: null,
  },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">

        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex w-fit items-center gap-2 font-display text-xl font-extrabold"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary">
                <Mountain className="h-5 w-5" />
              </span>
              TrailNotFound
            </Link>

            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-white/60">
              Discover extraordinary places, plan meaningful journeys
              and share the experiences that make travel unforgettable.
            </p>

            <a
              href="mailto:hello@trailnotfound.com"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4" />
              Get in touch
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-white">
                  {col.title}
                </h3>

                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith('mailto:') ? (
                        <a
                          href={link.href}
                          className="text-sm text-white/60 transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-white/60 transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">

          <p className="text-center text-sm text-white/50 md:text-left">
            © {new Date().getFullYear()} TrailNotFound. Made for the journey.
          </p>

          <div className="flex items-center gap-3">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href ?? undefined}
                aria-label={label}
                aria-disabled={!href}
                tabIndex={href ? 0 : -1}
                onClick={!href ? (e) => e.preventDefault() : undefined}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white/70 transition-colors ${
                  href
                    ? 'hover:bg-white/15 hover:text-white'
                    : 'cursor-not-allowed opacity-40'
                }`}
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
