/**
 * Email Notification Service
 * 
 * Placeholder implementation for sending notification emails.
 * Replace with your preferred email service provider (SendGrid, Resend, AWS SES, etc.)
 */

interface EmailOptions {
  to: string
  subject: string
  template: 'asset-approved' | 'asset-rejected'
  data: {
    assetTitle: string
    assetId: string
    contributorName: string
    rejectionReason?: string
  }
}

/**
 * Send notification email to contributor
 * 
 * This is a placeholder implementation. Replace with your actual email service.
 * 
 * Recommended providers:
 * - Resend (https://resend.com) - Simple, developer-friendly
 * - SendGrid (https://sendgrid.com) - Enterprise-grade
 * - AWS SES (https://aws.amazon.com/ses/) - Cost-effective at scale
 * - Postmark (https://postmarkapp.com) - Transactional emails
 * - Nodemailer with SMTP - Self-hosted option
 */
export async function sendNotificationEmail(options: EmailOptions): Promise<void> {
  const { to, subject, template, data } = options

  // Check if email is enabled
  const emailEnabled = process.env.EMAIL_ENABLED === 'true'
  if (!emailEnabled) {
    console.log('[Email] Email notifications disabled. Would send:', {
      to,
      subject,
      template,
    })
    return
  }

  // Generate email content based on template
  const emailContent = generateEmailContent(template, data)

  try {

    const nodemailer = require('nodemailer')
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@yourdomain.com',
      to,
      subject,
      html: emailContent.html,
      text: emailContent.text,
    })
  

    console.log('[Email] Sending email:', {
      to,
      subject,
      template,
    })
    console.log('[Email] Content:', emailContent.html)

    // In production, replace the above console.log with your actual email service call
    // For now, this is a no-op that logs the email details

  } catch (error) {
    console.error('[Email] Failed to send email:', error)
    throw error
  }
}

/**
 * Generate email content based on template
 */
function generateEmailContent(
  template: 'asset-approved' | 'asset-rejected',
  data: EmailOptions['data']
): { html: string; text: string } {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const assetUrl = `${baseUrl}/asset/${data.assetId}`

  if (template === 'asset-approved') {
    return {
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Asset Approved</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">🎉 Asset Approved!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Hi ${data.contributorName},</p>
              <p>Great news! Your asset <strong>"${data.assetTitle}"</strong> has been approved and is now live on the platform.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <p style="margin: 0;"><strong>Asset:</strong> ${data.assetTitle}</p>
                <p style="margin: 5px 0 0 0;"><strong>Status:</strong> <span style="color: #10b981;">Approved ✓</span></p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${assetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Asset</a>
              </div>
              <p>Thank you for contributing to our platform!</p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Best regards,<br>The Team</p>
            </div>
          </body>
        </html>
      `,
      text: `
        Asset Approved!

        Hi ${data.contributorName},

        Great news! Your asset "${data.assetTitle}" has been approved and is now live on the platform.

        Asset: ${data.assetTitle}
        Status: Approved ✓

        View your asset: ${assetUrl}

        Thank you for contributing to our platform!

        Best regards,
        The Team
      `,
    }
  } else {
    // asset-rejected
    return {
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Asset Rejected</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Asset Review Update</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Hi ${data.contributorName},</p>
              <p>We've reviewed your asset <strong>"${data.assetTitle}"</strong>, but unfortunately it doesn't meet our current guidelines.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <p style="margin: 0;"><strong>Asset:</strong> ${data.assetTitle}</p>
                <p style="margin: 5px 0 0 0;"><strong>Status:</strong> <span style="color: #ef4444;">Rejected</span></p>
                ${data.rejectionReason ? `<p style="margin: 15px 0 0 0;"><strong>Reason:</strong> ${data.rejectionReason}</p>` : ''}
              </div>
              <p>Please review our guidelines and feel free to submit a new asset that meets our requirements.</p>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Best regards,<br>The Team</p>
            </div>
          </body>
        </html>
      `,
      text: `
        Asset Review Update

        Hi ${data.contributorName},

        We've reviewed your asset "${data.assetTitle}", but unfortunately it doesn't meet our current guidelines.

        Asset: ${data.assetTitle}
        Status: Rejected
        ${data.rejectionReason ? `Reason: ${data.rejectionReason}` : ''}

        Please review our guidelines and feel free to submit a new asset that meets our requirements.

        If you have any questions, please don't hesitate to contact our support team.

        Best regards,
        The Team
      `,
    }
  }
}

