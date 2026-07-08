import config from '@payload-config'
import { NextRequest } from 'next/server'
import { createLocalReq, getPayload } from 'payload'

import { checkRateLimit } from '@/utilities/rateLimit'
import { verifyTurnstileToken } from '@/utilities/turnstile/server'
import { TURNSTILE_FORM_ACTION } from '@/utilities/turnstile/shared'

const FORM_RATE_LIMIT_MAX_REQUESTS = 5
const FORM_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const HONEYPOT_FIELD_NAME = 'website'

type SubmissionDataItem = {
  field: string
  value: string
}

type FormSubmissionRequestBody = {
  form?: number | string
  honeypot?: string
  submissionData?: SubmissionDataItem[]
  turnstileToken?: string
}

const getClientIP = (request: NextRequest): string | undefined => {
  const cloudflareIP = request.headers.get('cf-connecting-ip')

  if (cloudflareIP) {
    return cloudflareIP
  }

  const forwardedFor = request.headers.get('x-forwarded-for')

  return forwardedFor?.split(',')[0]?.trim() || undefined
}

const badRequest = (message: string, code: string): Response => {
  return Response.json(
    {
      code,
      errors: [{ message }],
      status: 'BAD_REQUEST',
    },
    { status: 400 },
  )
}

const tooManyRequests = (retryAfterSeconds: number): Response => {
  return Response.json(
    {
      code: 'rate_limit_exceeded',
      errors: [{ message: 'Too many attempts. Please try again later.' }],
      status: 'TOO_MANY_REQUESTS',
    },
    {
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
      status: 429,
    },
  )
}

const getFormID = (form: FormSubmissionRequestBody['form']): number | undefined => {
  if (typeof form === 'number' && Number.isInteger(form)) {
    return form
  }

  if (typeof form === 'string') {
    const parsed = Number.parseInt(form, 10)

    if (Number.isInteger(parsed)) {
      return parsed
    }
  }

  return undefined
}

export async function POST(request: NextRequest): Promise<Response> {
  let body: FormSubmissionRequestBody

  try {
    body = (await request.json()) as FormSubmissionRequestBody
  } catch {
    return badRequest('Invalid request body.', 'invalid_request_body')
  }

  const { form, honeypot, submissionData, turnstileToken } = body
  const formID = getFormID(form)
  const clientIP = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'

  const rateLimitResult = checkRateLimit({
    key: `form-submit:${clientIP || userAgent}`,
    limit: FORM_RATE_LIMIT_MAX_REQUESTS,
    windowMs: FORM_RATE_LIMIT_WINDOW_MS,
  })

  if (!rateLimitResult.success) {
    const retryAfterSeconds = Math.max(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000), 1)
    return tooManyRequests(retryAfterSeconds)
  }

  if (!formID || !Array.isArray(submissionData)) {
    return badRequest('Invalid form submission.', 'invalid_form_submission')
  }

  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return badRequest('Invalid form submission.', 'honeypot_triggered')
  }

  if (!turnstileToken) {
    return badRequest('Please complete the verification step.', 'turnstile_required')
  }

  const turnstileResult = await verifyTurnstileToken({
    expectedAction: TURNSTILE_FORM_ACTION,
    expectedHostname: process.env.TURNSTILE_EXPECTED_HOSTNAME,
    remoteIp: clientIP,
    token: turnstileToken,
  })

  if (!turnstileResult.success) {
    return badRequest('Verification failed. Please try again.', turnstileResult.reason)
  }

  const payload = await getPayload({ config })

  try {
    const payloadReq = await createLocalReq(
      {
        req: {
          headers: request.headers,
        },
      },
      payload,
    )

    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: formID,
        submissionData,
      },
      overrideAccess: true,
      req: payloadReq,
    })

    return Response.json({ id: submission.id, success: true })
  } catch (error) {
    payload.logger.error({ err: error, message: 'Error creating form submission' })

    return Response.json(
      {
        errors: [{ message: 'Something went wrong.' }],
        status: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 },
    )
  }
}
