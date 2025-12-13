import packageInfo from './package.json'

const { env } = process

const config = {
    url: {
        API_URL: env.API_URL || 'http://froms.login.no/api/',
        CDN_URL: 'https://cdn.login.no',
        GITLAB_URL: 'https://gitlab.login.no',
        LOGIN_URL: 'https://login.no',
        MAIL_URL: 'kontakt@login.no',
        LINKEDIN_URL: 'https://www.linkedin.com/company/linjeforeningen-login/about',
        WIKI_URL: 'https://wiki.login.no',
        FACEBOOK_URL: 'https://facebook.com/LogNTNU',
        INSTAGRAM_URL: 'https://www.instagram.com/login_linjeforening/',
        DISCORD_URL: 'https://discord.gg/login-ntnu'

    },
    authInternal: {
        BASE_URL: env.NEXT_PUBLIC_BASE_URL,
        LOGIN_URL: `${env.NEXT_PUBLIC_BASE_URL}/api/login`,
        REDIRECT_URL: `${env.NEXT_PUBLIC_BASE_URL}/api/callback`,
        TOKEN_URL: `${env.NEXT_PUBLIC_BASE_URL}/api/token`,
        LOGOUT_URL: `${env.NEXT_PUBLIC_BASE_URL}/api/logout`,
    },
    authService: {
        CLIENT_ID: env.AUTH_CLIENT_ID,
        CLIENT_SECRET: env.AUTH_CLIENT_SECRET,
        AUTH_URL: `${env.AUTH_URL}/application/o/authorize/`,
        TOKEN_URL: `${env.AUTH_URL}/application/o/token/`,
        USERINFO_URL: `${env.AUTH_URL}/application/o/userinfo/`,
    },
    version: packageInfo.version,
}

export default config
