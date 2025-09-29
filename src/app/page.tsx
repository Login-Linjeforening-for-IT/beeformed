import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import config from '@config'
import { LoginPage } from 'uibee/components'

export default async function Home() {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value
    const redirectAfterLogin = Cookies.get('redirect_after_login')?.value
    if (token) {
        redirect(redirectAfterLogin || '/profile')
    }

    return (
        <LoginPage
            title='BeeFormed'
            redirectURI={config.auth.LOGIN_URI}
            version={config.version}
        />
    )
}
