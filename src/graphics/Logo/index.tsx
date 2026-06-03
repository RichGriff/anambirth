import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Media } from '@/payload-types'
import Image from 'next/image'

export const Logos: React.FC = async () => {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'settings' })
  const lightModeLogo = settings.lightModeLogo as Media
  const darkModeLogo = settings.darkModeLogo as Media

  return (
    <>
      <Image
        src={lightModeLogo.url || ''}
        alt={lightModeLogo.alt || 'Light Mode Logo'}
        width={220}
        height={lightModeLogo.height || 480}
        className={'light-mode-image'}
      />
      <Image
        src={darkModeLogo.url || ''}
        alt={darkModeLogo.alt || 'Dark Mode Logo'}
        width={220}
        height={darkModeLogo.height || 480}
        className={'dark-mode-image'}
      />
    </>
  )
}
