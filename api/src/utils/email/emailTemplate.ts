import { generateQRCodeImage } from '#utils/qr/generator.ts'

type EmailTemplate = {
    subject: string
    html: string
    text: string
    attachments?: Array<{
        filename: string
        content: Buffer
        contentType: string
    }>
}

export type EmailContent = {
    title: string
    status: 'registered' | 'waitlisted' | 'rejected' | 'cancelled' | 'bumped'
    ownerEmail: string
    actionUrl?: string
    actionText?: string
    submissionId: string
}

const COMPANY_INFO = {
    name: 'Login - Linjeforeningen for IT',
    nameShort: 'Login',
    logo: 'https://cdn.login.no/img/logo/logo.svg',
    website: 'https://login.no',
    email: 'kontakt@login.no',
    primaryColor: '#fd8738'
}

function generateTextFromStatus(status: EmailContent['status']): {header : string, body: string} {
    const statusText: Record<EmailContent['status'], { header: string; body: string }> = {
        registered: {
            header: 'Submission Confirmed',
            body: 'Your submission has been confirmed.'
        },
        waitlisted: {
            header: 'Added to Waitlist',
            body: 'You have been added to the waitlist.'
        },
        rejected: {
            header: 'Submission Rejected',
            body: 'Your submission has been rejected.'
        },
        cancelled: {
            header: 'Submission Cancelled',
            body: 'Your submission has been cancelled.'
        },
        bumped: {
            header: 'Moved out of Waitlist',
            body: 'A spot opened up and you have been moved from the waitlist to registered list.'
        }
    }

    return statusText[status]
}

function generateEmailHTML(content: EmailContent, qrCodeImageDataUrl?: string | null): string {
    const { title, status, ownerEmail, actionUrl, actionText, submissionId } = content

    const { header, body } = generateTextFromStatus(status)

    return `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta http-equiv="x-ua-compatible" content="ie=edge"/>
            <meta name="x-apple-disable-message-reformatting"/>
            <title>${title}</title>
            <style>
                body,
                table,
                td,
                a {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }

                table,
                td {
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                }

                img {
                    -ms-interpolation-mode: bicubic;
                    border: 0;
                    outline: none;
                    text-decoration: none;
                    display: block;
                }

                table {
                    border-collapse: collapse !important;
                }

                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    background-color: #0a0a0a;
                }

                a {
                    color: ${COMPANY_INFO.primaryColor};
                }

                @media screen and (max-width: 620px) {
                    .container {
                        width: 100% !important;
                    }

                    .pad-32 {
                        padding: 24px !important;
                    }

                    .h1 {
                        font-size: 24px !important;
                        line-height: 32px !important;
                    }

                    .stack,
                    .stack td {
                        display: block !important;
                        width: 100% !important;
                    }

                    .stack td {
                        padding-bottom: 16px !important;
                    }
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a;">
            <div style="display: none; font-size: 1px; color: #0a0a0a; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
                ${header} - ${title}
            </div>

            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
                <tr>
                    <td align="center" style="padding: 32px 12px;">
                        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" class="container" style="width: 600px; max-width: 600px; background-color: #181818; border: 1px solid #333333; border-radius: 16px; overflow: hidden; border-collapse: separate !important;">
                            <tr>
                                <td class="pad-32" style="padding: 32px; border-bottom: 1px solid #333333;">
                                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="left" valign="middle" style="width: 100px;">
                                                <img src="https://cdn.login.no/img/logo/logo-white-small.png" alt="Login logo" width="50" style="width: 50px; max-width: 50px; height: auto; display: block;" />
                                            </td>
                                            <td align="right" valign="middle" style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 18px; line-height: 24px; letter-spacing: 1px; color: #e5e2e1; font-weight: 700; text-transform: uppercase;">
                                                ${COMPANY_INFO.name}
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td class="pad-32" style="padding: 32px; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color: #e5e2e1;">
                                    <h1 class="h1" style="margin: 0 0 32px 0; font-size: 28px; line-height: 36px; font-weight: 800; color: #e5e2e1;">
                                        ${header}
                                    </h1>

                                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #202020; border: 1px solid #333333; border-radius: 12px; margin-bottom: 32px; border-collapse: separate !important;">
                                        <tr>
                                            <td align="center" style="padding: 24px;">
                                                <table role="presentation" width="148" border="0" cellspacing="0" cellpadding="0" style="width: 148px; height: 148px; border: 2px dashed rgba(253, 135, 56, 0.3); border-radius: 8px; background-color: #ffffff; border-collapse: separate !important;">
                                                    <tr>
                                                        <td align="center" valign="middle" style="width: 148px; height: 148px;">
                                                            ${qrCodeImageDataUrl
                                                                ? `<img src="${qrCodeImageDataUrl}" alt="QR code (unblock to view / see attachments)" width="148" height="148" style="width: 148px; height: 148px; display: block; border-radius: 6px;" />`
                                                                : '<span style="display: inline-block; font-family: system-ui, -apple-system, \'Segoe UI\', Roboto, Arial, sans-serif; font-size: 11px; line-height: 14px; color: rgba(253, 135, 56, 0.7); letter-spacing: 1px; text-transform: uppercase; padding: 8px;">QR Unavailable</span>'}
                                                        </td>
                                                    </tr>
                                                </table>
                                                <p style="margin: 12px 0 0 0; font-size: 10px; line-height: 14px; letter-spacing: 2px; text-transform: uppercase; color: #a1a1a1;">Ticket QR</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                                        <tr>
                                            <td align="left" valign="middle" style="font-size: 10px; line-height: 12px; letter-spacing: 3px; text-transform: uppercase; color: ${COMPANY_INFO.primaryColor}; font-weight: 700; white-space: nowrap; padding-right: 8px;">Entry Details</td>
                                            <td align="left" valign="middle" style="width: 100%; padding-left: 8px;">
                                                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td style="vertical-align: middle; height: 16px;">
                                                            <div style="height:1px; background: #333333; width:100%; line-height:1px; font-size:1px;">&nbsp;</div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1c1c1c; border: 1px solid #333333; border-radius: 12px; margin-bottom: 16px; border-collapse: separate !important;">
                                        <tr class="stack">
                                            <td valign="top" style="padding: 20px; width: 70%;">
                                                <p style="margin: 0 0 6px 0; font-size: 9px; line-height: 12px; letter-spacing: 2px; text-transform: uppercase; color: #a1a1a1;">Form Title</p>
                                                <p style="margin: 0; font-size: 16px; line-height: 22px; color: #e5e2e1; font-weight: 500;">${title}</p>
                                            </td>
                                            <td valign="top" style="padding: 20px; width: 30%;">
                                                <p style="margin: 0 0 6px 0; font-size: 9px; line-height: 12px; letter-spacing: 2px; text-transform: uppercase; color: #a1a1a1;">Status</p>
                                                <span style="display: inline-block; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(253, 135, 56, 0.2); background-color: rgba(253, 135, 56, 0.1); color: ${COMPANY_INFO.primaryColor}; font-size: 9px; line-height: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${status}</span>
                                            </td>
                                        </tr>
                                    </table>

                                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1c1c1c; border: 1px solid #333333; border-radius: 12px; margin-bottom: 16px; border-collapse: separate !important;">
                                        <tr>
                                            <td style="padding: 20px;">
                                                <p style="margin: 0 0 6px 0; font-size: 9px; line-height: 12px; letter-spacing: 2px; text-transform: uppercase; color: #a1a1a1;">Reference ID</p>
                                                <p style="margin: 0; font-size: 16px; line-height: 22px; color: #e5e2e1; font-weight: 500;">${submissionId}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1c1c1c; border: 1px solid #333333; border-radius: 12px; margin-bottom: 16px; border-collapse: separate !important;">
                                        <tr>
                                            <td style="padding: 20px;">
                                                <p style="margin: 0 0 6px 0; font-size: 9px; line-height: 12px; letter-spacing: 2px; text-transform: uppercase; color: #a1a1a1;">Message</p>
                                                <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #e5e2e1; white-space: pre-line;">${body}</p>
                                                <p style="margin: 0 0 6px 0; font-size: 9px; line-height: 12px; letter-spacing: 2px; text-transform: uppercase; color: #a1a1a1;">Form Contact</p>
                                                <p style="margin: 0; font-size: 15px; line-height: 24px; color: #e5e2e1;">${ownerEmail}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    ${actionUrl && actionText ? `
                                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="padding-top: 12px;">
                                                <!--[if mso]>
                                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${actionUrl}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="50%" stroke="f" fillcolor="${COMPANY_INFO.primaryColor}">
                                                    <w:anchorlock/>
                                                    <center style="color:#ffffff;font-family:Arial, sans-serif;font-size:14px;font-weight:700;">${actionText}</center>
                                                </v:roundrect>
                                                <![endif]-->
                                                <!--[if !mso]><!-- -->
                                                <a href="${actionUrl}" style="display: inline-block; background-color: ${COMPANY_INFO.primaryColor}; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 14px; line-height: 48px; padding: 0 28px; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;">${actionText}</a>
                                                <!--<![endif]-->
                                            </td>
                                        </tr>
                                    </table>
                                    ` : ''}
                                </td>
                            </tr>

                            <tr>
                                <td class="pad-32" style="padding: 32px; border-top: 1px solid #333333; background-color: #202020; text-align: center; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;">
                                    <p style="margin: 0 0 4px 0; font-size: 10px; line-height: 16px; color: #a1a1a1;"><strong style="color: #e5e2e1;">${COMPANY_INFO.name}</strong></p>
                                    <p style="margin: 0 0 4px 0; font-size: 10px; line-height: 16px; color: #a1a1a1;">Questions? Contact us at <a href="mailto:${COMPANY_INFO.email}" style="color: ${COMPANY_INFO.primaryColor}; text-decoration: none;">${COMPANY_INFO.email}</a></p>
                                    <p style="margin: 0; font-size: 10px; line-height: 16px; color: #7a7a7a;"><em>Sent from BeeFormed on behalf of ${COMPANY_INFO.nameShort}.</em></p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    </html>`
}

function generateEmailText(content: EmailContent): string {
    const { title, status, ownerEmail, actionUrl, actionText } = content

    const { header, body } = generateTextFromStatus(status)

    let text = `${header}\n\n`
    
    text += `${title}\n\n`

    text += `${status}\n\n`

    text += `${body}\n\n`

    text += `If you have any questions, please contact the form owner at ${ownerEmail}.\n\n`

    if (actionUrl && actionText) {
        text += `${actionText}: ${actionUrl}\n\n`
    }

    text += '---\n\n'
    text += `${COMPANY_INFO.name}\n`
    text += `${COMPANY_INFO.email}\n`
    text += `${COMPANY_INFO.website}\n\n`
    text += 'Denne e-posten ble sendt fra BeeFormed - vårt skjemasystem.\n'
    text += `Hvis du har spørsmål, kontakt oss på ${COMPANY_INFO.email}`

    return text
}

export async function createEmailTemplate(content: EmailContent): Promise<EmailTemplate> {
    const qrCode = content.submissionId ? await generateQRCodeImage({ data: content.submissionId }) : null
    const attachments = qrCode && content.submissionId
        ? [{
            filename: `submission-${content.submissionId}-qr.png`,
            content: qrCode.pngBuffer,
            contentType: 'image/png'
        }]
        : undefined

    const { header } = generateTextFromStatus(content.status)

    return {
        subject: `${header} - ${content.title}`,
        html: generateEmailHTML(content, qrCode?.pngDataUrl),
        text: generateEmailText(content),
        attachments
    }
}