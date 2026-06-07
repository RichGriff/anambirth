import type { ReactNode } from 'react'

import type { BackgroundColorValue } from '@/fields/backgroundColor'
import { cn } from '@/utilities/ui'

type SectionBackgroundProps = {
  id?: string
  bg?: BackgroundColorValue | null
  showDivider?: boolean | null
  className?: string
  children: ReactNode
}

const sectionBackgroundVariants: Record<BackgroundColorValue, string> = {
  'bg-primary': 'bg-background text-black',
  'bg-secondary': 'bg-blue-50 text-blue-950',
  'bg-black': 'bg-gray-800 text-gray-50',
  'bg-white': 'bg-secondary text-gray-950',
  'bg-light': 'bg-[#F6F3EC] text-primary',
  'bg-lighter': 'bg-[#FCF9F2] text-primary',
  'bg-dark': 'bg-primary text-foreground-light',
}

export const SectionBackground = ({
  id,
  bg = 'bg-white',
  showDivider,
  className,
  children,
}: SectionBackgroundProps) => {
  const resolvedBackground =
    sectionBackgroundVariants[bg ?? 'bg-white'] ?? sectionBackgroundVariants['bg-white']

  return (
    <section id={id} className={cn(resolvedBackground, 'py-16', className)}>
      {children}
      {showDivider && <div className="mx-auto mt-26 h-px w-full max-w-xs bg-border" />}
    </section>
  )
}
