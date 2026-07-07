import 'server-only'

const TURNSTILE_SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TURNSTILE_TIMEOUT_MS = 10000

type VerifyTurnstileTokenArgs = {
  expectedAction?: string
  expectedHostname?: string
  remoteIp?: string
  token: string
}

type TurnstileSiteverifyResponse = {
  action?: string
  challenge_ts?: string
  'error-codes'?: string[]
  hostname?: string
  success: boolean
}

export type TurnstileVerificationResult =
  | { success: true; response: TurnstileSiteverifyResponse }
  | { errorCodes?: string[]; reason: string; success: false }

export const verifyTurnstileToken = async ({
  expectedAction,
  expectedHostname,
  remoteIp,
  token,
}: VerifyTurnstileTokenArgs): Promise<TurnstileVerificationResult> => {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    return {
      reason: 'turnstile_not_configured',
      success: false,
    }
  }

  if (!token || typeof token !== 'string') {
    return {
      reason: 'turnstile_token_missing',
      success: false,
    }
  }

  const controller = new AbortController()
  const timeoutID = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS)

  try {
    const body = new URLSearchParams({
      response: token,
      secret,
    })

    if (remoteIp) {
      body.set('remoteip', remoteIp)
    }

    const response = await fetch(TURNSTILE_SITEVERIFY_URL, {
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      signal: controller.signal,
    })

    const result = (await response.json()) as TurnstileSiteverifyResponse

    if (!result.success) {
      return {
        errorCodes: result['error-codes'],
        reason: 'turnstile_verification_failed',
        success: false,
      }
    }

    if (expectedAction && result.action !== expectedAction) {
      return {
        reason: 'turnstile_action_mismatch',
        success: false,
      }
    }

    if (expectedHostname && result.hostname !== expectedHostname) {
      return {
        reason: 'turnstile_hostname_mismatch',
        success: false,
      }
    }

    return {
      response: result,
      success: true,
    }
  } catch (_error) {
    return {
      reason: 'turnstile_verification_error',
      success: false,
    }
  } finally {
    clearTimeout(timeoutID)
  }
}
