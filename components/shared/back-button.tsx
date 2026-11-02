
'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

type BackButtonProps = {
  fallbackHref?: string
  label?: string
  className?: string
}

export function BackButton({
  fallbackHref = '/explore',
  label = 'Back to Explore',
  className = '',
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition-all hover:-translate-x-1 hover:bg-secondary ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  )
}
