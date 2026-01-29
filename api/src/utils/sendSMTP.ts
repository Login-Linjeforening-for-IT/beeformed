import config from '#constants'
import nodemailer from 'nodemailer'
import { createEmailTemplate, type EmailContent } from '#utils/emailTemplate.ts'

type MailOptions = {
    to: string
    subject: string
    text: string
    html?: string
}

const retryDelays = [60 * 1000, 5 * 60 * 1000, 5 * 60 * 1000]

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
    const mailOptions = { to, subject, text, html }

    try {
        const info = await attemptSend(mailOptions)
        return info?.response || 'SMTP disabled'
    } catch (error: any) {
        return 'Email failed initially, queued for retry'
    }
}

async function attemptSend(mailOptions: MailOptions, retryIndex: number = -1) {
    try {
        return await transporter?.sendMail({
            from: {
                name: 'Login Forms',
                address: config.SMTP_FROM
            },
            ...mailOptions,
        }) 
    } catch (error) {
        console.error(
            retryIndex === -1
                ? `Error sending email`
                : `Retry attempt ${retryIndex + 1} failed:`,
            error
        )

        const nextIndex = retryIndex + 1
        if (nextIndex < retryDelays.length) {
            setTimeout(() => attemptSend(mailOptions, nextIndex), retryDelays[nextIndex])
        } else {
            console.error(`Failed to send email after multiple attempts`)
        }

        if (retryIndex === -1) {
            throw error
        }
    }
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