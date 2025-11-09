import config from '@config'
import { createUser } from '@utils/api'
import { NextRequest } from 'next/server'
import { authToken } from 'uibee/utils'

export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const userID = url.searchParams.get('id')
    const username = url.searchParams.get('name')
    const userEmail = url.searchParams.get('email')
    const access_token = url.searchParams.get('access_token')

    fetch(`${config.url.API_URL}users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
            user_id: userID,
            name: username,
            email: userEmail
        })
    })

    return await authToken({
        req: request,
        frontendURL: config.authInternal.BASE_URL,
        redirectPath: '/'
    })
}