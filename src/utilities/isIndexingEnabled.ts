type IndexingEnvironment = Partial<
  Pick<
    NodeJS.ProcessEnv,
    | 'ALLOW_INDEXING'
    | 'APP_ENV'
    | 'NEXT_PUBLIC_SERVER_URL'
    | 'VERCEL_ENV'
    | 'VERCEL_PROJECT_PRODUCTION_URL'
  >
>

export const isIndexingEnabled = (env: IndexingEnvironment = process.env): boolean => {
  if (env.ALLOW_INDEXING === 'true') return true
  if (env.ALLOW_INDEXING === 'false') return false

  const productionURL = env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined

  return (
    env.APP_ENV === 'production' ||
    env.VERCEL_ENV === 'production' ||
    (Boolean(productionURL) && env.NEXT_PUBLIC_SERVER_URL === productionURL)
  )
}
