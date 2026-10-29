type DocumentCollection = 'pages' | 'posts'

export const getDocumentPath = ({
  collection,
  slug,
}: {
  collection: DocumentCollection
  slug?: string | null
}): string => {
  if (!slug) return ''
  if (collection === 'pages' && slug === 'home') return '/'

  return collection === 'posts' ? `/posts/${slug}` : `/${slug}`
}
