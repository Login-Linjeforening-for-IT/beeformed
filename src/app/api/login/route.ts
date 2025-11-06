import config from '@config'
import { authLogin } from 'uibee/utils'

export async function GET() {
    return await authLogin({
        authURL: config.authService.AUTH_URL,
        clientID: config.authService.CLIENT_ID,
        redirectURL: config.authInternal.REDIRECT_URL,
    })
}