import packageInfo from './package.json'

const config = {
    url: {
        API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.queenbee.login.no/v1',
    },
    version: packageInfo.version,
}

export default config
