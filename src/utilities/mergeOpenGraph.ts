import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

export const defaultMetaDescription =
  'Soul-led doula support through conception, pregnancy, birth, postpartum, loss, and matrescence.'
export const defaultSocialImagePath = '/media/hero-1200x630.png'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: defaultMetaDescription,
  images: [
    {
      url: `${getServerSideURL()}${defaultSocialImagePath}`,
      width: 1200,
      height: 630,
      alt: 'Anam Birth doula support',
    },
  ],
  siteName: 'Anam Birth',
  title: 'Anam Birth',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
