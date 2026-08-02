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
    const onScroll = () => setScrolled(window.scrollY > 24)

    onScroll()

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-white/10 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">

        {/* Logo */}

        <Link
          href="/"
          className={cn(
            'flex items-center gap-2 font-display text-lg font-extrabold tracking-tight md:text-xl',
            scrolled ? 'text-foreground' : 'text-white'
          )}
        >
          <span
            className={cn(
              'grid h-8 w-8 place-items-center rounded-xl',
              scrolled
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/15 text-white backdrop-blur'
            )}
          >
            <Mountain className="h-4 w-4" />
          </span>

          TrailNotFound
        </Link>

        {/* Desktop Navigation */}

        <ul
          className={cn(
            'hidden items-center gap-8 text-sm font-medium lg:flex',
            scrolled ? 'text-muted-foreground' : 'text-white/85'
          )}
        >
          {NAV_LINKS.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className={cn(
                  'transition-all duration-300',
                  pathname === item.href
                    ? 'text-primary font-semibold'
                    : scrolled
                    ? 'hover:text-foreground'
                    : 'hover:text-white'
                )}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side */}

        <div className="flex items-center gap-2 md:gap-3">

          <button
            aria-label="Search"
            className={cn(
              'grid h-10 w-10 place-items-center rounded-full transition-colors',
              scrolled
                ? 'hover:bg-secondary'
                : 'hover:bg-white/15 text-white'
            )}
          >
            <Search className="h-5 w-5" />
          </button>

          {status === 'authenticated' && session?.user ? (
            <button
              onClick={() => signOut({ redirectTo: '/' })}
              className={cn(
                'hidden items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors md:inline-flex',
                scrolled
                  ? 'hover:bg-secondary'
                  : 'hover:bg-white/15 text-white'
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
                  {session.user.name?.[0] ?? 'U'}
                </span>
              )}
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className={cn(
                'hidden rounded-full px-4 py-2 text-sm font-medium transition-colors md:inline-flex',
                scrolled
                  ? 'hover:bg-secondary'
                  : 'hover:bg-white/15 text-white'
              )}
            >
              Login
            </Link>
          )}

          <Link
            href="/explore"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 md:inline-flex"
          >
            Start Exploring
          </Link>

          <button
            aria-label="Open Menu"
            onClick={() => setOpen(true)}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-full lg:hidden',
              scrolled
                ? 'hover:bg-secondary'
                : 'hover:bg-white/15 text-white'
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}

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
              className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">

                <span className="font-display text-lg font-bold">
                  TrailNotFound
                </span>

                <button
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              <ul className="flex flex-col gap-2">

                {NAV_LINKS.map((item) => (

                  <li key={item.title}>

                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block rounded-xl px-3 py-3 text-lg',
                        pathname === item.href
                          ? 'bg-primary text-white'
                          : 'hover:bg-secondary'
                      )}
                    >
                      {item.title}
                    </Link>

                  </li>

                ))}

              </ul>

              <div className="mt-8 flex flex-col gap-3">

                {status === 'authenticated' ? (
                  <button
                    onClick={() => {
                      setOpen(false)
                      signOut({ redirectTo: '/' })
                    }}
                    className="rounded-full border border-border px-5 py-3 text-center"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-border px-5 py-3 text-center"
                  >
                    Login
                  </Link>
                )}

                <Link
                  href="/explore"
                  className="rounded-full bg-primary px-5 py-3 text-center font-semibold text-primary-foreground"
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