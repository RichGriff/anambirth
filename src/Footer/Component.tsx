import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { BookmarkIcon, Share2Icon } from 'lucide-react'
import ShareButton from '@/components/ui/share-button'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const socialLinks = footerData?.socialLinks || []
  const legalLinks = footerData?.legalLinks || []

  return (
    <footer className="mt-auto bg-[#062225] text-foreground-light px-4">
      <div className="container py-16 grid gap-8 grid-cols-2 md:grid-cols-12 md:gap-6">
        {/* Footer Logo */}
        <Link className="hidden sm:flex items-start md:col-span-3" href="/">
          <Logo
            loading="eager"
            priority="high"
            imagePath="/logo-icon-dark.svg"
            className="w-26.25"
          />
        </Link>

        {/* Navigation */}
        <div className="flex flex-col items-start gap-3 md:col-span-3 ">
          <h4 className="text-xs font-semibold uppercase text-accent">Socials</h4>
          <nav className="flex flex-col gap-4">
            {socialLinks.map(({ link }, i) => {
              return (
                <CMSLink
                  className="hover:underline text-secondary/80 hover:text-secondary transition-colors"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        </div>

        <div className="flex flex-col items-start gap-3 md:col-span-3 ">
          <h4 className="text-xs font-semibold uppercase text-accent">Navigation</h4>
          <nav className="flex flex-col gap-4">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="hover:underline text-secondary/80 hover:text-secondary transition-colors"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        </div>

        <div className="flex flex-col items-start gap-3 md:col-span-3 ">
          <h4 className="text-xs font-semibold uppercase text-accent">Legal</h4>
          <nav className="flex flex-col gap-4">
            {legalLinks.map(({ link }, i) => {
              return (
                <CMSLink
                  className="hover:underline text-secondary/80 hover:text-secondary transition-colors"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        </div>
      </div>

      <div className="border-t border-border/10 py-4 container flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Mobile Footer Logo */}
        <Link className="flex sm:hidden items-start md:col-span-3 my-2" href="/">
          <Logo loading="eager" priority="high" imagePath="/logo-icon-dark.svg" className="w-16" />
        </Link>
        <p className="text-sm text-muted-foreground-light">© 2026 All rights reserved.</p>
        <div className="flex items-center gap-4 py-2">
          {/* <Share2Icon className="w-5 h-5 text-secondary/80 hover:text-secondary transition-colors cursor-pointer" /> */}
          <ShareButton
            title="Anam Birth | Soul-led Doula Support"
            text="Grounded, soulful support for your journey"
          />
          <BookmarkIcon className="w-5 h-5 text-secondary/80 hover:text-secondary transition-colors cursor-pointer" />
        </div>
        {/* <p className="text-sm text-muted-foreground-light">
          Built by{' '}
          <a href="https://richgriffiths.me.uk/" className="underline">
            Rich Griffiths
          </a>
          .
        </p> */}
        {/* <ThemeSelector /> */}
      </div>
    </footer>
  )
}
