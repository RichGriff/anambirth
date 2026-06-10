import { CollectionConfig } from 'payload'

import { revalidateMusicTracks, revalidateMusicTracksDelete } from './hooks/revalidateMusicTracks'

export const MusicTracks: CollectionConfig = {
  slug: 'music-tracks',
  labels: {
    singular: 'Music Track',
    plural: 'Music Tracks',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Relaxation and meditation tracks for the music player',
    defaultColumns: ['title', 'artist', 'category', 'updatedAt'],
  },
  access: { read: () => true },
  hooks: {
    afterChange: [revalidateMusicTracks],
    afterDelete: [revalidateMusicTracksDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Track Title',
    },
    {
      name: 'artist',
      type: 'text',
      label: 'Artist / Composer',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Relaxation', value: 'relaxation' },
        { label: 'Meditation', value: 'meditation' },
        { label: 'Sleep', value: 'sleep' },
        { label: 'Breathwork', value: 'breathwork' },
        { label: 'Ambient', value: 'ambient' },
      ],
    },
    {
      name: 'audioFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Audio File',
      required: true,
      filterOptions: {
        mimeType: {
          contains: 'audio',
        },
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
      admin: {
        description: 'Optional - shown as thumbnail in the playlist',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Playlist Order',
      admin: {
        description: 'Lower numbers appear first in the playlist',
      },
    },
  ],
}
