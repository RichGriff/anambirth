import React from 'react'

import type { CallToAction as CallToActionProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const CallToAction: React.FC<CallToActionProps> = ({ heading, description, links }) => {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-(family-name:--font-cormorant) text-4xl font-light leading-tight tracking-tight md:text-5xl lg:text-5xl text-balance">
            {heading}
          </h2>
          <p className="mt-6 text-lg leading-relaxed opacity-50 md:text-xl lg:mx-0 mx-auto w-full">
            {description}
          </p>
          {!!links?.length && (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {links.map(({ link }, i) => (
                <CMSLink key={i} size="lg" className="w-full sm:w-auto rounded-full" {...link} />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* <svg
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
      >
        <circle
          r={512}
          cx={512}
          cy={512}
          fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
          fillOpacity="0.7"
        />
        <defs>
          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
            <stop stopColor="#7775D6" />
            <stop offset={1} stopColor="#E935C1" />
          </radialGradient>
        </defs>
      </svg> */}
    </div>
  )
}
