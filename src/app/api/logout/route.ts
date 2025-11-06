import config from '@config'
import { authLogout } from 'uibee/utils'

export async function GET() {
    return await authLogout({
        frontendURL: config.authInternal.BASE_URL
    })
}
