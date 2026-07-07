import config from '@payload-config'
import { NextRequest } from 'next/server'
import { createLocalReq, getPayload } from 'payload'

import { verifyTurnstileToken } from '@/utilities/turnstile/server'
import { TURNSTILE_FORM_ACTION } from '@/utilities/turnstile/shared'

type SubmissionDataItem = {
  field: string
  value: string
}

type FormSubmissionRequestBody = {
  form?: number | string
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

  const { form, submissionData, turnstileToken } = body
  const formID = getFormID(form)

  if (!formID || !Array.isArray(submissionData)) {
    return badRequest('Invalid form submission.', 'invalid_form_submission')
  }

  if (!turnstileToken) {
    return badRequest('Please complete the verification step.', 'turnstile_required')
  }

  const turnstileResult = await verifyTurnstileToken({
    expectedAction: TURNSTILE_FORM_ACTION,
    expectedHostname: process.env.TURNSTILE_EXPECTED_HOSTNAME,
    remoteIp: getClientIP(request),
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
