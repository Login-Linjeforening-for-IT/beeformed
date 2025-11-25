import config from '#constants'
import nodemailer from 'nodemailer'
import { createEmailTemplate, type EmailContent } from './emailTemplate.ts'

type MailOptions = {
    to: string
    subject: string
    text: string
    html?: string
}

const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: config.SMTP_SECURE,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
    },
})

export default async function sendMail({ to, subject, text, html }: MailOptions): Promise<string> {
    const from = config.SMTP_FROM
    const mailOptions = { to, subject, text, html }
    try {
        const info = await transporter.sendMail({
            from,
            ...mailOptions,
        })
        return info.response
    } catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
}

export async function sendTemplatedMail(to: string, content: EmailContent): Promise<string> {
    const template = createEmailTemplate(content)
    return sendMail({
        to,
        subject: template.subject,
        text: template.text,
        html: template.html
    })
}