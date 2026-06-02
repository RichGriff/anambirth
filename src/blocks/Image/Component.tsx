import type { Image as ImgProps, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Image from 'next/image'

export const Img = (props: ImgProps) => {
  const { image } = props

  // If the upload relation isn't populated, avoid rendering a broken image.
  if (!image || typeof image === 'number') return null

  const { filename, alt, width, height, url, updatedAt } = image as Media
  const src = getMediaUrl(url || (filename ? `/media/${filename}` : ''), updatedAt)

  if (!src) return null

  return (
    <Image
      src={src}
      alt={alt || ''}
      height={height || 360}
      width={width || 640}
      className={`aspect-square overflow-hidden object-cover my-2 rounded-lg`}
    />
  )
}
