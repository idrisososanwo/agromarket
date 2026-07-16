import { SendEmailPayload } from '../types'

// ============================================================
// Provider-agnostic email abstraction
//
// To add a new provider:
//   1. Create src/features/notifications/services/email/<provider>.ts
//   2. Export an async function: sendEmail(payload: SendEmailPayload): Promise<void>
//   3. Add a case in the switch statement below
//   4. Set EMAIL_PROVIDER=<provider> in your .env
//
// Current supported providers: 'resend' | 'sendgrid' | 'postmark' | 'console'
// ============================================================

async function sendViaConsole(payload: SendEmailPayload): Promise<void> {
  // Development fallback — logs to console instead of sending real emails
  console.log('[Email Service - Console Provider]', {
    to: payload.to,
    subject: payload.subject,
    template: payload.template,
    data: payload.data,
  })
}

async function sendViaResend(payload: SendEmailPayload): Promise<void> {
  // Uncomment and install 'resend' package when ready:
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({ from: ..., to: payload.to, subject: payload.subject, html: ... })
  console.warn('[Email Service] Resend provider not yet configured. Falling back to console.')
  await sendViaConsole(payload)
}

async function sendViaSendGrid(payload: SendEmailPayload): Promise<void> {
  // Uncomment and install '@sendgrid/mail' when ready
  console.warn('[Email Service] SendGrid provider not yet configured. Falling back to console.')
  await sendViaConsole(payload)
}

async function sendViaPostmark(payload: SendEmailPayload): Promise<void> {
  // Uncomment and install 'postmark' when ready
  console.warn('[Email Service] Postmark provider not yet configured. Falling back to console.')
  await sendViaConsole(payload)
}

/**
 * Send an email notification using the configured provider.
 * Set EMAIL_PROVIDER env var to switch providers.
 */
export async function sendEmailNotification(payload: SendEmailPayload): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER ?? 'console'

  switch (provider) {
    case 'resend':
      return sendViaResend(payload)
    case 'sendgrid':
      return sendViaSendGrid(payload)
    case 'postmark':
      return sendViaPostmark(payload)
    default:
      return sendViaConsole(payload)
  }
}

// ============================================================
// Convenience helpers for common email types
// ============================================================

export async function sendRegistrationEmail(to: string, name: string): Promise<void> {
  return sendEmailNotification({
    to,
    subject: 'Welcome to AgroMarket',
    template: 'registration',
    data: { name },
  })
}

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  return sendEmailNotification({
    to,
    subject: 'Reset Your AgroMarket Password',
    template: 'password_reset',
    data: { resetLink },
  })
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderId: string,
  total: number
): Promise<void> {
  return sendEmailNotification({
    to,
    subject: `Your AgroMarket Order #${orderId.slice(0, 8)} is Confirmed`,
    template: 'order_confirmation',
    data: { orderId, total },
  })
}

export async function sendOrderStatusEmail(
  to: string,
  orderId: string,
  newStatus: string
): Promise<void> {
  return sendEmailNotification({
    to,
    subject: `Your AgroMarket Order Status Has Changed`,
    template: 'order_status_update',
    data: { orderId, newStatus },
  })
}

export async function sendPaymentConfirmationEmail(
  to: string,
  orderId: string,
  amountXlm: number
): Promise<void> {
  return sendEmailNotification({
    to,
    subject: 'Payment Confirmed — AgroMarket',
    template: 'payment_confirmation',
    data: { orderId, amountXlm },
  })
}

export async function sendSellerVerificationEmail(
  to: string,
  approved: boolean
): Promise<void> {
  return sendEmailNotification({
    to,
    subject: approved
      ? 'Your Seller Account Has Been Verified'
      : 'AgroMarket Seller Verification Update',
    template: 'seller_verification',
    data: { approved },
  })
}

export async function sendSecurityAlertEmail(
  to: string,
  event: string
): Promise<void> {
  return sendEmailNotification({
    to,
    subject: 'Security Alert — AgroMarket',
    template: 'security_alert',
    data: { event },
  })
}
