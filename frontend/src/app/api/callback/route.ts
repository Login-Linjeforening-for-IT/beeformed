import config from '@config'
import { NextRequest } from 'next/server'
import { authCallback } from 'uibee/utils'

export async function GET(request: NextRequest) {
    return await authCallback({
        req: request,
        tokenURL: config.authentik.url.token,
        clientID: config.authentik.clientId,
        clientSecret: config.authentik.clientSecret,
        redirectURL: config.auth.redirect,
        userInfoURL: config.authentik.url.userinfo,
        tokenRedirectURL: config.auth.token
    })
}