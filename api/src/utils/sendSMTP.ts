import config from '#constants'
import nodemailer from 'nodemailer'

type MailOptions = {
    to: string
    subject: string
    text: string
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

export default async function sendMail({ to, subject, text }: MailOptions): Promise<string> {
    const from = config.SMTP_FROM
    const mailOptions = { to, subject, text }
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