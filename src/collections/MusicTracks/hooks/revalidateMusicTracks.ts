import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'

import type { MusicTrack } from '../../../payload-types'

export const revalidateMusicTracks: CollectionAfterChangeHook<MusicTrack> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating music tracks')
    revalidateTag('music-tracks', 'max')
  }

  return doc
}

export const revalidateMusicTracksDelete: CollectionAfterDeleteHook<MusicTrack> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating music tracks after delete')
    revalidateTag('music-tracks', 'max')
  }

  return doc
}
