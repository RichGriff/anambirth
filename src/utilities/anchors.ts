export const formatAnchor = (value?: string | null) => {
  const normalized = value?.trim().replace(/^#+/, '').toLowerCase().replace(/\s+/g, '-')

  return normalized ? normalized : ''
}
