'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center">
        {navItems.map(({ link }, i) => {
          return (
            <CMSLink
              key={i}
              {...link}
              appearance="link"
              className="hover:no-underline text-secondary/80 hover:text-secondary transition-colors"
            />
          )
        })}
        {/* <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link> */}
        <Button asChild className="rounded-full px-6 transition-colors">
          <Link href="/#connection">Connection Call</Link>
        </Button>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
        aria-label="Toggle navigation menu"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6 text-primary" />
        ) : (
          <Menu className="w-6 h-6 text-primary" />
        )}
      </button>

      {/* Mobile Navigation Panel */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Panel */}
          <nav
            className="fixed top-0 right-0 h-screen w-64 bg-background shadow-lg z-50 md:hidden flex flex-col overflow-y-auto"
            style={{
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6 text-primary" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col p-4 gap-6">
              {navItems.map(({ link }, i) => {
                return (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="link"
                    className="hover:no-underline text-primary/80 hover:text-primary transition-colors text-lg"
                    onClick={handleNavClick}
                  />
                )
              })}

              {/* CTA Button with Links */}
              <Button
                asChild
                className="rounded-full px-6 transition-colors w-full mt-2"
                onClick={handleNavClick}
              >
                <Link href="/#connection">Connection Call</Link>
              </Button>
            </div>
          </nav>
        </>
      )}

      {/* Slide-in Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
