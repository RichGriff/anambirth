import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const socialLinks = footerData?.socialLinks || []
  const legalLinks = footerData?.legalLinks || []

  return (
    <footer className="mt-auto border-t border-border bg-[#062225] text-foreground-light">
      <div className="container py-16 grid gap-8 md:grid-cols-12 md:gap-6">
        {/* Logo */}
        <Link className="flex items-start md:col-span-3" href="/">
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
        <p className="text-sm text-muted-foreground-light">© 2026 All rights reserved.</p>
        <p className="text-sm text-muted-foreground-light">
          Built by{' '}
          <a href="https://richgriffiths.me.uk/" className="underline">
            Rich Griffiths
          </a>
          .
        </p>
        {/* <ThemeSelector /> */}
      </div>
    </footer>
  )
}
