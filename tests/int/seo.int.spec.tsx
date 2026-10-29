import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: { src: string } | string }) => (
    <img alt={alt} src={typeof src === 'string' ? src : src.src} />
  ),
}))

import { JsonLd } from '@/components/JsonLd'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Pagination } from '@/components/Pagination'
import { getDocumentPath } from '@/utilities/getDocumentPath'
import { redirects } from '../../redirects'

afterEach(cleanup)

describe('SEO routing and markup', () => {
  it('normalizes document paths', () => {
    expect(getDocumentPath({ collection: 'pages', slug: 'home' })).toBe('/')
    expect(getDocumentPath({ collection: 'pages', slug: 'about-me' })).toBe('/about-me')
    expect(getDocumentPath({ collection: 'posts', slug: 'birth-story' })).toBe(
      '/posts/birth-story',
    )
  })

  it('permanently redirects duplicate routes', async () => {
    const configuredRedirects = (await redirects?.()) || []

    expect(configuredRedirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ destination: '/', permanent: true, source: '/home' }),
        expect.objectContaining({
          destination: '/posts',
          permanent: true,
          source: '/posts/page/1',
        }),
      ]),
    )
  })

  it('renders crawlable pagination links', () => {
    render(<Pagination page={2} totalPages={3} />)

    expect(screen.getByRole('link', { name: 'Go to previous page' }).getAttribute('href')).toBe(
      '/posts',
    )
    expect(screen.getByRole('link', { name: 'Go to next page' }).getAttribute('href')).toBe(
      '/posts/page/3',
    )
  })

  it('serializes JSON-LD without allowing a closing script tag', () => {
    const { container } = render(
      <JsonLd data={{ '@context': 'https://schema.org', name: '</script><script>' }} />,
    )

    const script = container.querySelector('script[type="application/ld+json"]')

    expect(script?.innerHTML).toContain('\\u003c/script>')
    expect(script?.innerHTML).not.toContain('</script><script>')
  })

  it('prefers explicit image alt text over CMS alt text', () => {
    render(
      <ImageMedia
        alt="Bridie providing doula support"
        resource={
          {
            alt: 'CMS image description',
            height: 100,
            updatedAt: '2026-01-01T00:00:00.000Z',
            url: '/media/doula.webp',
            width: 100,
          } as never
        }
      />,
    )

    expect(screen.getByAltText('Bridie providing doula support')).not.toBeNull()
    expect(screen.queryByAltText('Image Placeholder Text')).toBeNull()
  })
})
