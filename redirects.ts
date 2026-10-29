import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const canonicalRedirects = [
    {
      destination: '/',
      permanent: true,
      source: '/home',
    },
    {
      destination: '/posts',
      permanent: true,
      source: '/posts/page/1',
    },
  ]

  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  return [...canonicalRedirects, internetExplorerRedirect]
}
