import config from '@config'
import { authLogin } from 'uibee/utils'

export async function GET() {
    return await authLogin({
        authURL: config.authentik.url.auth,
        clientID: config.authentik.clientId,
        redirectURL: config.auth.redirect,
    })
}