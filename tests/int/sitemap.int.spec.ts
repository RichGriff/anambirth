import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { find } = vi.hoisted(() => ({
  find: vi.fn(),
}))

vi.mock('payload', () => ({
  getPayload: vi.fn(async () => ({ find })),
}))

vi.mock('@payload-config', () => ({
  default: {},
}))

vi.mock('next/cache', () => ({
  unstable_cache: (callback: () => unknown) => callback,
}))

import robots from '@/app/robots'
import { GET as getSitemapIndex } from '@/app/(frontend)/(sitemaps)/sitemap.xml/route'
import { GET as getPagesSitemap } from '@/app/(frontend)/(sitemaps)/pages-sitemap.xml/route'
import { GET as getPostsSitemap } from '@/app/(frontend)/(sitemaps)/posts-sitemap.xml/route'
import { isIndexingEnabled } from '@/utilities/isIndexingEnabled'

describe('sitemaps', () => {
  beforeEach(() => {
    vi.stubEnv('ALLOW_INDEXING', 'true')
    vi.stubEnv('APP_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://anam.example/')
    find.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('uses ALLOW_INDEXING as the explicit override', () => {
    expect(
      isIndexingEnabled({ APP_ENV: 'production', ALLOW_INDEXING: 'false' }),
    ).toBe(false)
    expect(isIndexingEnabled({ APP_ENV: 'staging', ALLOW_INDEXING: 'true' })).toBe(true)
  })

  it('returns no sitemap URLs when indexing is disabled', async () => {
    vi.stubEnv('ALLOW_INDEXING', 'false')

    const [indexResponse, pagesResponse, postsResponse] = await Promise.all([
      getSitemapIndex(),
      getPagesSitemap(),
      getPostsSitemap(),
    ])

    expect(indexResponse.status).toBe(404)
    expect(pagesResponse.status).toBe(404)
    expect(postsResponse.status).toBe(404)
    expect(find).not.toHaveBeenCalled()
    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    })
  })

  it('generates a production sitemap index', async () => {
    const response = await getSitemapIndex()
    const xml = await response.text()

    expect(response.status).toBe(200)
    expect(xml).toContain('<loc>https://anam.example/pages-sitemap.xml</loc>')
    expect(xml).toContain('<loc>https://anam.example/posts-sitemap.xml</loc>')
    expect(robots()).toMatchObject({
      sitemap: 'https://anam.example/sitemap.xml',
    })
  })

  it('generates published page URLs with home at the site root', async () => {
    find.mockResolvedValueOnce({
      docs: [
        { slug: 'home', updatedAt: '2026-01-01T00:00:00.000Z' },
        { slug: 'about', updatedAt: '2026-01-02T00:00:00.000Z' },
      ],
    })

    const response = await getPagesSitemap()
    const xml = await response.text()

    expect(response.status).toBe(200)
    expect(xml).toContain('<loc>https://anam.example/</loc>')
    expect(xml).toContain('<loc>https://anam.example/about</loc>')
    expect(xml).not.toContain('<loc>https://anam.example/search</loc>')
    expect(xml).toContain('<loc>https://anam.example/posts</loc>')
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'pages',
        overrideAccess: false,
        draft: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
      }),
    )
  })

  it('generates published post URLs under the posts route', async () => {
    find.mockResolvedValueOnce({
      docs: [{ slug: 'birth-story', updatedAt: '2026-01-01T00:00:00.000Z' }],
    })

    const response = await getPostsSitemap()
    const xml = await response.text()

    expect(response.status).toBe(200)
    expect(xml).toContain('<loc>https://anam.example/posts/birth-story</loc>')
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'posts',
        overrideAccess: false,
        draft: false,
        where: {
          _status: {
            equals: 'published',
          },
          guestBlog: {
            not_equals: true,
          },
        },
      }),
    )
  })
})
