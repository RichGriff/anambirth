import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { generateMeta } from '@/utilities/generateMeta'
import { defaultMetaDescription, defaultSocialImagePath } from '@/utilities/mergeOpenGraph'

describe('SEO metadata', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://anambirth.com')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('generates a canonical URL and matching Open Graph URL', async () => {
    const metadata = await generateMeta({
      doc: {
        title: 'About Bridie',
        meta: {
          description: 'Meet Bridie and learn about her approach to doula support.',
          title: 'About Bridie | Anam Birth',
        },
      },
      pathname: '/about-me',
    })

    expect(metadata).toMatchObject({
      alternates: {
        canonical: 'https://anambirth.com/about-me',
      },
      description: 'Meet Bridie and learn about her approach to doula support.',
      openGraph: {
        title: 'About Bridie | Anam Birth',
        url: 'https://anambirth.com/about-me',
      },
      title: 'About Bridie | Anam Birth',
      twitter: {
        card: 'summary_large_image',
        title: 'About Bridie | Anam Birth',
      },
    })
  })

  it('uses document content and branded defaults when SEO fields are empty', async () => {
    const metadata = await generateMeta({
      doc: {
        title: 'Embodied Self-Care for Doulas',
        excerpt: 'Practical reflections on caring for yourself while supporting others.',
      },
      pathname: '/posts/embodied-self-care-for-doulas',
    })

    expect(metadata).toMatchObject({
      description: 'Practical reflections on caring for yourself while supporting others.',
      openGraph: {
        images: [
          expect.objectContaining({
            url: `https://anambirth.com${defaultSocialImagePath}`,
          }),
        ],
      },
      title: 'Embodied Self-Care for Doulas',
    })
  })

  it('uses the Anam Birth description when no page description exists', async () => {
    const metadata = await generateMeta({ doc: null, pathname: '/' })

    expect(metadata.description).toBe(defaultMetaDescription)
    expect(metadata.description).not.toContain('Payload')
  })
})
