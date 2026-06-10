import type { Endpoint } from 'payload'

type AnalyticsStats = {
  pageviews: number
  visitors: number
  visits: number
  bounces: number
}

type AnalyticsSeriesPoint = {
  x: string
  y: number
}

type AnalyticsPageviews = {
  pageviews: AnalyticsSeriesPoint[]
  sessions: AnalyticsSeriesPoint[]
}

export type AnalyticsSummary = {
  stats: AnalyticsStats
  pageviews: AnalyticsPageviews
  topPages: AnalyticsSeriesPoint[]
}

// Cache the token so we're not logging in on every request
let cachedToken: string | null = null
let tokenExpiry: number = 0

const getRequiredEnv = (name: 'UMAMI_URL' | 'UMAMI_USERNAME' | 'UMAMI_PASSWORD' | 'UMAMI_WEBSITE_ID') => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const getUmamiApiURL = (path: string) => {
  const baseURL = getRequiredEnv('UMAMI_URL').replace(/\/$/, '')
  const apiBaseURL = baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`

  return `${apiBaseURL}${path.startsWith('/') ? path : `/${path}`}`
}

async function fetchUmamiJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(getUmamiApiURL(path), init)

  if (!response.ok) {
    throw new Error(`Umami request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

async function getUmamiToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const { token } = await fetchUmamiJSON<{ token?: string }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: getRequiredEnv('UMAMI_USERNAME'),
      password: getRequiredEnv('UMAMI_PASSWORD'),
    }),
  })

  if (!token) {
    throw new Error('Umami login did not return a token')
  }

  cachedToken = token
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000 // cache for 23 hours

  return token
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const token = await getUmamiToken()
  const headers = { Authorization: `Bearer ${token}` }
  const websiteID = getRequiredEnv('UMAMI_WEBSITE_ID')

  const endAt = Date.now()
  const startAt = endAt - 30 * 24 * 60 * 60 * 1000 // last 30 days
  const params = new URLSearchParams({
    startAt: String(startAt),
    endAt: String(endAt),
  })

  const [stats, pageviews, topPages] = await Promise.all([
    fetchUmamiJSON<AnalyticsStats>(`/websites/${websiteID}/stats?${params}`, { headers }),
    fetchUmamiJSON<AnalyticsPageviews>(`/websites/${websiteID}/pageviews?${params}&unit=day&timezone=UTC`, {
      headers,
    }),
    fetchUmamiJSON<AnalyticsSeriesPoint[]>(`/websites/${websiteID}/metrics?${params}&type=path&limit=5`, {
      headers,
    }),
  ])

  return { stats, pageviews, topPages }
}

export const analyticsEndpoint: Endpoint = {
  path: '/analytics/summary',
  method: 'get',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      return Response.json(await getAnalyticsSummary())
    } catch (error) {
      req.payload.logger.error({ err: error }, 'Failed to load Umami analytics summary')

      const message = error instanceof Error ? error.message : 'Failed to load analytics summary'

      return Response.json({ error: message }, { status: 500 })
    }
  },
}
