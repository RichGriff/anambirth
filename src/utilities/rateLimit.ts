type RateLimitState = {
  count: number
  resetAt: number
}

type CheckRateLimitArgs = {
  key: string
  limit: number
  windowMs: number
}

type RateLimitResult = {
  limit: number
  remaining: number
  resetAt: number
  success: boolean
}

const rateLimitStore = new Map<string, RateLimitState>()

export const checkRateLimit = ({ key, limit, windowMs }: CheckRateLimitArgs): RateLimitResult => {
  const now = Date.now()
  const current = rateLimitStore.get(key)

  if (!current || current.resetAt <= now) {
    const nextState = {
      count: 1,
      resetAt: now + windowMs,
    }

    rateLimitStore.set(key, nextState)

    return {
      limit,
      remaining: Math.max(limit - 1, 0),
      resetAt: nextState.resetAt,
      success: true,
    }
  }

  if (current.count >= limit) {
    return {
      limit,
      remaining: 0,
      resetAt: current.resetAt,
      success: false,
    }
  }

  current.count += 1

  return {
    limit,
    remaining: Math.max(limit - current.count, 0),
    resetAt: current.resetAt,
    success: true,
  }
}
