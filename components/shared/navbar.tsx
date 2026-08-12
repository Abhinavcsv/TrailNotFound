'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Mountain } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/constants/navigation'

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    onScroll()

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Homepage has a hero image, so navbar can be transparent there.
  // All inner pages have a light background, so navbar stays readable.
  const isHomePage = pathname === '/'

  const useLightNavbar = !isHomePage || scrolled

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        useLightNavbar
          ? 'border-b border-border/60 bg-white/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/75'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">

        {/* ================= LOGO ================= */}

        <Link
          href="/"
          className={cn(
            'flex items-center gap-2 font-display text-lg font-extrabold tracking-tight transition-colors md:text-xl',
            useLightNavbar
              ? 'text-foreground'
              : 'text-white'
          )}
        >
          <span
            className={cn(
              'grid h-8 w-8 place-items-center rounded-xl transition-all',
              useLightNavbar
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-white/15 text-white backdrop-blur-md'
            )}
          >
            <Mountain className="h-4 w-4" />
          </span>

          TrailNotFound
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}

        <ul
          className={cn(
            'hidden items-center gap-7 text-sm font-medium lg:flex',
            useLightNavbar
              ? 'text-muted-foreground'
              : 'text-white/90'
          )}
        >
          {NAV_LINKS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href))

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative transition-colors duration-200',
                    isActive
                      ? 'font-semibold text-primary'
                      : useLightNavbar
                        ? 'hover:text-foreground'
                        : 'hover:text-white'
                  )}
                >
                  {item.title}

                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* ================= RIGHT SIDE ================= */}

        <div className="flex items-center gap-2 md:gap-3">

          {/* Search */}

          <button
            aria-label="Search"
            className={cn(
              'grid h-10 w-10 place-items-center rounded-full transition-all',
              useLightNavbar
                ? 'text-foreground hover:bg-secondary'
                : 'text-white hover:bg-white/15'
            )}
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* Login / Logout */}

          {status === 'authenticated' && session?.user ? (
            <button
              onClick={() => signOut({ redirectTo: '/' })}
              className={cn(
                'hidden items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all md:inline-flex',
                useLightNavbar
                  ? 'text-foreground hover:bg-secondary'
                  : 'text-white hover:bg-white/15'
              )}
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'Profile'}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {session.user.name?.[0]?.toUpperCase() ?? 'U'}
                </span>
              )}

              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              className={cn(
                'hidden rounded-full px-4 py-2 text-sm font-medium transition-all md:inline-flex',
                useLightNavbar
                  ? 'text-foreground hover:bg-secondary'
                  : 'text-white hover:bg-white/15'
              )}
            >
              Login
            </Link>
          )}

          {/* Start Exploring */}

          <Link
            href="/explore"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/35 md:inline-flex"
          >
            Start Exploring
          </Link>

          {/* Mobile menu button */}

          <button
            aria-label="Open Menu"
            onClick={() => setOpen(true)}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-full transition-all lg:hidden',
              useLightNavbar
                ? 'text-foreground hover:bg-secondary'
                : 'text-white hover:bg-white/15'
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Mobile header */}

              <div className="mb-8 flex items-center justify-between">

                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 font-display text-lg font-extrabold text-foreground"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <Mountain className="h-4 w-4" />
                  </span>

                  TrailNotFound
                </Link>

                <button
                  aria-label="Close Menu"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              {/* Mobile links */}

              <ul className="flex flex-col gap-1">

                {NAV_LINKS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' &&
                      pathname.startsWith(item.href))

                  return (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'block rounded-xl px-4 py-3 text-lg font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-secondary'
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  )
                })}

              </ul>

              {/* Mobile actions */}

              <div className="mt-8 flex flex-col gap-3">

                {status === 'authenticated' ? (
                  <button
                    onClick={() => {
                      setOpen(false)
                      signOut({ redirectTo: '/' })
                    }}
                    className="rounded-full border border-border px-5 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-border px-5 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    Login
                  </Link>
                )}

                <Link
                  href="/explore"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
                >
                  Start Exploring
                </Link>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}