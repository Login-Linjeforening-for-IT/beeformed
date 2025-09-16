import packageInfo from './package.json'

const config = {
    url: {
        API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.queenbee.login.no/v1',
        GITLAB: 'https://gitlab.login.no',
        LOGIN: 'https://login.no'
    },
    version: packageInfo.version,
}

export default config
