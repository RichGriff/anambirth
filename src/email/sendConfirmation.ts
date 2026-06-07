// src/email/sendConfirmation.ts
import fs from 'fs'
import path from 'path'

export async function sendConfirmationEmail(
  payload: any,
  submissionData: { field: string; value: string }[],
) {
  const getValue = (field: string) => submissionData.find((d) => d.field === field)?.value ?? ''

  const name = getValue('name')
  const email = getValue('emailAddress')
  const journey = getValue('journey')
  const details = getValue('details')

  if (!email) return

  const templatePath = path.resolve(process.cwd(), 'src/email/confirmationEmail.html')
  let html = fs.readFileSync(templatePath, 'utf-8')

  // Replace placeholders
  html = html
    .replace(/{{name}}/g, name)
    .replace(/{{email}}/g, email)
    .replace(/{{details}}/g, details)
    .replace(/{{journey}}/g, journey)
    .replace(
      /{{submittedAt}}/g,
      new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    )

  await payload.sendEmail({
    to: email,
    from: process.env.SMTP_USER,
    subject: `We've received your enquiry, ${name}!`,
    html,
  })
}
