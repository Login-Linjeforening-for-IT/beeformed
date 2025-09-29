'use client'

import { useState, useEffect } from 'react'
import Navigation from './navigation'
import MobileNavigation from './mobileNavigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, User } from 'lucide-react'
import { getCookie } from 'uibee/utils'


export default function TopBar() {
    const [token, setToken] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setToken(getCookie('access_token'))
    }, [])
    function toggle() {
        setIsOpen(!isOpen)
    }

    return (
            <div
                className={`flex max-w-[calc(var(--w-page)+2rem)] w-full m-auto p-2 h-[var(--h-topbar)] transition-all duration-500
                    ${isOpen ? 'h-screen bg-[var(--color-bg-topbar-open)]' : ''}
                    800px:justify-between 800px:p-4`}
            >
                <div className="block h-12 p-1 800px:p-0 relative w-12">
                    <Link href='/' onClick={isOpen ? toggle : () => {}} >
                        <Image
                            alt='Logo'
                            src='/images/logo-white-small.svg'
                            fill={true}
                            quality={100}
                            className="object-contain"
                        />
                    </Link>
                </div>
                <Navigation />
                <nav className="flex w-[calc(100vw-8rem)] justify-end h-12 mr-4 800px:w-fit 800px:mr-0 items-center">
                    <div className='h-full flex items-center gap-2'>
                        <Link href="/profile">
                            <User className='w-8 h-8'/>
                        </Link>
                        {token &&
                            <Link href="/api/logout" onClick={(e) => {e.preventDefault(); window.location.href='/api/logout'}}>
                                <LogOut className='w-8 h-8'/>
                            </Link>
                        }
                    </div>
                </nav>
                {/* Hamburger button for mobile */}
                <button
                    className={`relative w-12 h-12 cursor-pointer bg-none border-none 800px:hidden flex flex-col justify-center items-center`}
                    onClick={toggle}
                >
                    {/* Top bun */}
                    <div
                        className={`absolute left-2 w-8 h-1 rounded bg-login-50 transition-all duration-300
                            top-1/2 -translate-y-1/2
                            ${isOpen ? 'rotate-[-45deg] translate-y-0' : '-translate-y-2'}
                        `}
                    />
                    {/* Bottom bun */}
                    <div
                        className={`absolute left-2 w-8 h-1 rounded bg-login-50 transition-all duration-300
                            top-1/2 -translate-y-1/2
                            ${isOpen ? 'rotate-45 translate-y-0' : 'translate-y-2'}
                        `}
                    />
                </button>
                <MobileNavigation open={isOpen} setIsOpen={setIsOpen} />
            </div>
    )
}
