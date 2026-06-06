'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  siteSettings: {
    headerLogo?: string
    siteName?: string
  }
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, siteSettings }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const { headerLogo, siteName } = siteSettings || {}

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-primary backdrop-blur-sm border-b border-primary/10 px-2 sm:px-0`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="py-6 flex justify-between container">
        <Link href="/">
          <Logo
            logo={headerLogo}
            siteName={siteName}
            loading="eager"
            priority="high"
            className={`transition-[width] duration-300 ease-out ${isScrolled ? 'w-40' : 'w-52'}`}
          />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
