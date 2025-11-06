import packageInfo from './package.json'

const { env } = process

const config = {
    url: {
        API_URL: env.API_URL || 'http://localhost:8080/api/',
        GITLAB: 'https://gitlab.login.no',
        LOGIN: 'https://login.no'
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
