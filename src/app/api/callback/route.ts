import config from '@config'
import { NextRequest } from 'next/server'
import { authCallback } from 'uibee/utils'

export async function GET(request: NextRequest) {
    return await authCallback({
        req: request,
        tokenURL: config.authService.TOKEN_URL,
        clientID: config.authService.CLIENT_ID,
        clientSecret: config.authService.CLIENT_SECRET,
        redirectURL: config.authInternal.REDIRECT_URL,
        userInfoURL: config.authService.USERINFO_URL,
        tokenRedirectURL: config.authInternal.TOKEN_URL
    })
}