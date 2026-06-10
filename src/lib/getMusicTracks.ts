import type { MusicTrack as MusicTrackProps } from '@/payload-types'

/**
 * Fetch music tracks from Payload CMS.
 * Call this in a Next.js Server Component or generateStaticParams.
 *
 * Usage:
 *   import { getMusicTracks } from '@/lib/getMusicTracks'
 *   const tracks = await getMusicTracks()
 */
export async function getMusicTracks(): Promise<MusicTrackProps[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/music-tracks?sort=order&limit=50&depth=1`, {
    // Revalidate every hour, or use { cache: 'no-store' } for always-fresh
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    console.error('Failed to fetch music tracks:', res.status, res.statusText)
    return []
  }

  const data = await res.json()

  // Payload wraps results in { docs: [...] }
  return (data.docs ?? []) as MusicTrackProps[]
}
