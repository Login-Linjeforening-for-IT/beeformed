import config from '#constants'
import nodemailer from 'nodemailer'
import { createEmailTemplate, type EmailContent } from '#utils/emailTemplate.ts'

type MailOptions = {
    to: string
    subject: string
    text: string
    html?: string
}

const transporter = config.DISABLE_SMTP ? null : nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: config.SMTP_SECURE,
    pool: true,
})

export default async function send({ to, subject, text, html }: MailOptions): Promise<string> {
    if (config.DISABLE_SMTP) {
        return 'SMTP disabled'
    }
    const from = config.SMTP_FROM
    const mailOptions = { to, subject, text, html }
    
    let lastError: any
    const maxRetries = 3

    for (let i = 0; i < maxRetries; i++) {
        try {
            const info = await transporter?.sendMail({
                from,
                ...mailOptions,
            })
            return info?.response || 'SMTP disabled'
        } catch (error: any) {
            lastError = error
            console.error(`Error sending email (attempt ${i + 1}/${maxRetries}):`, error)

            if (i === maxRetries - 1) {
                throw error
            }

            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
    }
    throw lastError
}

export async function sendTemplatedMail(to: string, content: EmailContent): Promise<string> {
    const template = await createEmailTemplate(content)
    return send({
        to,
        subject: template.subject,
        text: template.text,
        html: template.html
    })
}