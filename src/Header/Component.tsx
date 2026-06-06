import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import type { Media, Setting } from '@/payload-types'

export async function Header() {
  const payload = await getPayload({ config: configPromise })

  const headerData = await getCachedGlobal('header', 1)()

  const siteSettings = await payload.findGlobal({
    slug: 'settings',
    depth: 1,
    overrideAccess: true,
    select: {
      headerLogo: true,
      siteName: true,
    },
  })

  const headerLogo =
    typeof siteSettings.headerLogo === 'object' && siteSettings.headerLogo
      ? ((siteSettings.headerLogo as Media).url ?? undefined)
      : undefined

  const clientSiteSettings: { headerLogo?: string; siteName?: string } = {
    headerLogo,
    siteName: siteSettings.siteName ?? undefined,
  }

  return <HeaderClient data={headerData} siteSettings={clientSiteSettings} />
}
