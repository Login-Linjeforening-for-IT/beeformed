'use client'

import { useState, useEffect } from 'react'
import { getCookie } from 'uibee/utils'
import { Navbar as NavBar, NavItem } from 'uibee/components'
import config from '@config'

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        setToken(getCookie('access_token'))
    }, [])

    return (
        <NavBar
            token={token}
            disableLanguageToggle={true}
            lang={undefined}
            theme={'dark'}
        >
            <NavItem
                href={config.url.LOGIN}
                external
            >
                Login
            </NavItem>
        </NavBar>
    )
}
