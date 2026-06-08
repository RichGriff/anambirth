import type { Accreditation as AccreditationProps } from '@/payload-types'
import { SectionBackground } from '../Section/SectionBackground'
import Link from 'next/link'
import { Media } from '@/components/Media'

export const Accreditation = (props: AccreditationProps) => {
  const { title, items, bg } = props

  return (
    <SectionBackground bg={bg} className="py-0 px-6">
      <div className="mx-auto max-w-6xl text-center pb-24">
        <h2 className="mx-auto max-w-2xl text-muted-foreground">{title}</h2>
        <div
          className={`mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none ${items && items?.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}
        >
          {items?.map((item, index) => {
            return (
              <Link key={index} href={item.url || '#'} className="col-span-2 lg:col-span-1">
                <Media
                  resource={item.logo}
                  alt={item.name || `Accreditation ${index + 1}`}
                  imgClassName="max-h-12 w-full object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition duration-300 ease-in-out hover:cursor-pointer"
                />
              </Link>
            )
          })}
        </div>
      </div>
    </SectionBackground>
  )
}
