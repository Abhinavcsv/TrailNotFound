
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Menu,
  X,
  Mountain,
  Sparkles,
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/constants/navigation'

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Detect page scroll
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

  // Close mobile menu after navigation
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close mobile menu using Escape key
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const isHomePage = pathname === '/'
  const useLightNavbar = !isHomePage || scrolled

  // Active navigation link
  const isActiveLink = (href: string) => {
    return (
      pathname === href ||
      (href !== '/' && pathname.startsWith(href))
    )
  }

  // Navigation link styling
  const linkClass = (href: string) => {
    const isActive = isActiveLink(href)

    return cn(
      'relative whitespace-nowrap transition-colors duration-200',
      isActive
        ? 'font-semibold text-primary'
        : useLightNavbar
          ? 'text-muted-foreground hover:text-foreground'
          : 'text-white/85 hover:text-white'
    )
  }

  const closeMenu = () => setOpen(false)

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        useLightNavbar
          ? 'border-b border-border/60 bg-white/90 shadow-sm backdrop-blur-xl'
          : 'border-b border-white/10 bg-black/10 backdrop-blur-sm'
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-5 md:h-20 md:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="TrailNotFound home"
          className={cn(
            'group flex shrink-0 items-center gap-2 font-display text-lg font-extrabold tracking-tight transition-colors md:text-xl',
            useLightNavbar ? 'text-foreground' : 'text-white'
          )}
        >
          <span
            className={cn(
              'grid h-9 w-9 place-items-center rounded-xl transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105',
              useLightNavbar
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-white/20 bg-white/15 text-white backdrop-blur-md'
            )}
          >
            <Mountain className="h-[18px] w-[18px]" />
          </span>

          <span>TrailNotFound</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-5 text-[13px] font-medium lg:flex xl:gap-7 xl:text-sm">
          {NAV_LINKS.map((item) => {
            const isActive = isActiveLink(item.href)

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={linkClass(item.href)}
                >
                  {item.title}

                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-indicator"
                      className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-primary"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Desktop Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Search */}
          <Link
            href="/explore"
            aria-label="Search destinations"
            title="Search destinations"
            className={cn(
              'grid h-10 w-10 place-items-center rounded-full transition-all duration-200 hover:scale-105',
              useLightNavbar
                ? 'text-foreground hover:bg-secondary'
                : 'text-white hover:bg-white/15'
            )}
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>

          {/* Authentication */}
          {status === 'loading' ? (
            <div
              aria-label="Loading account"
              className="hidden h-9 w-20 animate-pulse rounded-full bg-secondary md:block"
            />
          ) : status === 'authenticated' && session?.user ? (
            <>
              {/* Profile */}
              <Link
                href="/profile"
                aria-label="Open profile"
                title={session.user.name ?? 'Profile'}
                className="hidden items-center gap-2 rounded-full px-2 py-1.5 transition-colors hover:bg-secondary md:inline-flex"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'Profile'}
                    width={30}
                    height={30}
                    className="rounded-full object-cover ring-2 ring-border"
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {session.user.name?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                )}

                <span
                  className={cn(
                    'max-w-24 truncate text-sm font-medium',
                    useLightNavbar
                      ? 'text-foreground'
                      : 'text-white'
                  )}
                >
                  {session.user.name?.split(' ')[0] ?? 'Profile'}
                </span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={() => signOut({ redirectTo: '/' })}
                className={cn(
                  'hidden rounded-full px-3 py-2 text-sm font-medium transition-colors md:inline-flex',
                  useLightNavbar
                    ? 'text-foreground hover:bg-secondary'
                    : 'text-white hover:bg-white/15'
                )}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                'hidden rounded-full px-4 py-2 text-sm font-semibold transition-all md:inline-flex',
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
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 md:inline-flex"
          >
            Start Exploring
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-full transition-colors lg:hidden',
              useLightNavbar
                ? 'text-foreground hover:bg-secondary'
                : 'text-white hover:bg-white/15'
            )}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          >
            <motion.aside
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-white p-5 shadow-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Mobile Header */}
              <div className="mb-8 flex items-center justify-between">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-2 font-display text-lg font-extrabold text-foreground"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <Mountain className="h-[18px] w-[18px]" />
                  </span>

                  TrailNotFound
                </Link>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                  className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Label */}
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Explore the world
              </p>

              {/* Mobile Links */}
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((item) => {
                  const isActive = isActiveLink(item.href)

                  return (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-secondary'
                        )}
                      >
                        {item.title}

                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* Mobile Actions */}
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <Link
                  href="/planner"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Sparkles className="h-4 w-4" />
                  Try AI Planner
                </Link>

                {status === 'loading' ? (
                  <div className="h-12 animate-pulse rounded-full bg-secondary" />
                ) : status === 'authenticated' ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className="rounded-full border border-border px-5 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        closeMenu()
                        signOut({ redirectTo: '/' })
                      }}
                      className="rounded-full border border-border px-5 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-full border border-border px-5 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    Login
                  </Link>
                )}

                <Link
                  href="/explore"
                  onClick={closeMenu}
                  className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20"
                >
                  Start Exploring
                </Link>
              </div>

              {/* Mobile Footer */}
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Find your next story with TrailNotFound.
              </p>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
