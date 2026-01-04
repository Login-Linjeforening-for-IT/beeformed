import { LOGO_SVG } from '#utils/logo.ts'

type EmailTemplate = {
    subject: string
    html: string
    text: string
}

export type EmailContent = {
    title: string
    header?: string
    content: string
    actionUrl?: string
    actionText?: string
}

const COMPANY_INFO = {
    name: 'Login - Linjeforeningen for IT',
    logo: 'https://cdn.login.no/img/logo/logo.svg',
    website: 'https://login.no',
    email: 'kontakt@login.no',
    primaryColor: '#fd8738',
    socialLinks: {
        linkedin: 'https://www.linkedin.com/company/linjeforeningen-login/about',
        facebook: 'https://facebook.com/LogNTNU',
        instagram: 'https://www.instagram.com/login_linjeforening/',
        discord: 'https://discord.gg/login-ntnu',
        github: 'https://github.com/Login-Linjeforening-for-IT'
    }
}

function generateEmailHTML(content: EmailContent): string {
    const { title, header, content: bodyContent, actionUrl, actionText } = content

    return `
        <!DOCTYPE html>
        <html lang="no">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                }

                @media (prefers-color-scheme: dark) {
                    body {
                        background-color: #1a1a1a;
                        color: #e9ecef;
                    }
                }

                .container {
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border: 1px solid #e1e5e9;
                    border-radius: 8px;
                    max-width: 600px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                @media (prefers-color-scheme: dark) {
                    .container {
                        background-color: #2d2d2d;
                        border-color: #404040;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    }
                }

                .header {
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e1e5e9;
                    text-align: center;
                }

                .logo {
                    max-width: 200px;
                    height: auto;
                    margin-bottom: 15px;
                }

                .landing-logo_corner {
                    fill: none;
                    stroke: ${COMPANY_INFO.primaryColor};
                    stroke-miterlimit: 10;
                    stroke-width: 3.5px;
                }

                .landing-logo_letter {
                    fill: #333;
                }

                @media (prefers-color-scheme: dark) {
                    .landing-logo_letter {
                        fill: #ffffff;
                    }
                }

                .header h1 {
                    color: #333;
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                    line-height: 1.2;
                }

                .email-header {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    color: #333;
                }

                @media (prefers-color-scheme: dark) {
                    .header {
                        border-bottom-color: #404040;
                    }
                    .header h1 {
                        color: #ffffff;
                    }
                    .email-header {
                        color: #ffffff;
                    }
                }

                .content {
                    margin-bottom: 20px;
                    /* keep text left-aligned for readability */
                    text-align: left;
                }

                .action-button {
                    display: inline-block;
                    background-color: ${COMPANY_INFO.primaryColor};
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 16px;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .action-wrap {
                    text-align: center;
                    margin: 20px 0;
                }

                .action-button:hover {
                    background-color: #e76f00;
                }

                .footer {
                    border-top: 1px solid #e1e5e9;
                    padding-top: 25px;
                    margin-top: 30px;
                    font-size: 14px;
                    color: #666;
                    text-align: center;
                }

                @media (prefers-color-scheme: dark) {
                    .footer {
                        border-top-color: #404040;
                        color: #adb5bd;
                    }
                }

                a {
                    color: ${COMPANY_INFO.primaryColor};
                    text-decoration: none;
                }

                @media (max-width: 600px) {
                    body {
                        padding: 10px;
                    }
                    .container {
                        padding: 20px;
                        border-radius: 4px;
                    }
                    .header {
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                    }
                    .header h1 {
                        font-size: 24px;
                    }
                    .footer {
                        margin-top: 20px;
                        padding-top: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    ${LOGO_SVG.replace('<svg', '<svg style="max-width: 200px; height: auto; margin-bottom: 15px;"')}
                </div>

                ${header ? `<div class="email-header">${header}</div>` : ''}

                <div class="content">
                    <div style="white-space: pre-line;">${bodyContent}</div>

                    ${actionUrl && actionText ? `
                    <div class="action-wrap">
                        <a href="${actionUrl}" class="action-button">${actionText}</a>
                    </div>
                    ` : ''}
                </div>

                <div class="footer">
                    <p>
                        <strong>${COMPANY_INFO.name}</strong><br>
                        <a href="mailto:${COMPANY_INFO.email}">${COMPANY_INFO.email}</a> |
                        <a href="${COMPANY_INFO.website}">${COMPANY_INFO.website}</a>
                    </p>
                    <p>
                        <a href="${COMPANY_INFO.socialLinks.linkedin}">LinkedIn</a> |
                        <a href="${COMPANY_INFO.socialLinks.facebook}">Facebook</a> |
                        <a href="${COMPANY_INFO.socialLinks.instagram}">Instagram</a> |
                        <a href="${COMPANY_INFO.socialLinks.discord}">Discord</a> |
                        <a href="${COMPANY_INFO.socialLinks.github}">GitHub</a>
                    </p>
                    <p>Denne e-posten ble sendt fra BeeFormed - vårt nettskjemasystem.</p>
                </div>
            </div>
        </body>
    </html>`
}

function generateEmailText(content: EmailContent): string {
    const { title, header, content: bodyContent, actionUrl, actionText } = content

    let text = `${title}\n\n`

    if (header) {
        text += `${header}\n\n`
    }

    text += `${bodyContent}\n\n`

    if (actionUrl && actionText) {
        text += `${actionText}: ${actionUrl}\n\n`
    }

    text += '---\n\n'
    text += `${COMPANY_INFO.name}\n`
    text += `${COMPANY_INFO.email}\n`
    text += `${COMPANY_INFO.website}\n\n`
    text += `LinkedIn: ${COMPANY_INFO.socialLinks.linkedin}\n`
    text += `Facebook: ${COMPANY_INFO.socialLinks.facebook}\n`
    text += `Instagram: ${COMPANY_INFO.socialLinks.instagram}\n`
    text += `Discord: ${COMPANY_INFO.socialLinks.discord}\n`
    text += `GitHub: ${COMPANY_INFO.socialLinks.github}\n\n`
    text += 'Denne e-posten ble sendt fra BeeFormed - vårt nettskjemasystem.\n'
    text += `Hvis du har spørsmål, kontakt oss på ${COMPANY_INFO.email}`

    return text
}

export function createEmailTemplate(content: EmailContent): EmailTemplate {
    return {
        subject: content.title,
        html: generateEmailHTML(content),
        text: generateEmailText(content)
    }
}