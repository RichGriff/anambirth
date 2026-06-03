import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Media } from '@/payload-types'
import Image from 'next/image'

export const Icons: React.FC = async () => {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'settings' })
  const lightModeIcon = settings.lightModeIcon as Media
  const darkModeIcon = settings.darkModeIcon as Media

  return (
    <>
      <Image
        src={lightModeIcon.url || ''}
        alt={lightModeIcon.alt || 'Light Mode Icon'}
        width={220}
        height={lightModeIcon.height || 480}
        className={'light-mode-image'}
      />
      <Image
        src={darkModeIcon.url || ''}
        alt={darkModeIcon.alt || 'Dark Mode Icon'}
        width={220}
        height={darkModeIcon.height || 480}
        className={'dark-mode-image'}
      />
    </>
  )
}
