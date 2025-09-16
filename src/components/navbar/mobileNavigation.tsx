'use client'

import Link from 'next/link'
import { SetStateAction } from 'react'
import config from '@config'
import { ArrowUpRight } from 'lucide-react'

type MobileNavigationProps = {
    open: boolean,
    setIsOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function MobileNavigation({ open, setIsOpen }: MobileNavigationProps) {

    function close() {
        setIsOpen(false)
    }

    return (
        <nav
            className={`fixed top-16 w-[calc(100%-2rem)] max-w-[35rem] mx-auto left-0 right-0 z-50 transition-all duration-500
                ${open ? 'bg-[var(--color-bg-topbar-open)] h-[calc(3.9rem*1)] opacity-100' : 'h-0 opacity-0 pointer-events-none'}
            `}
        >
            <Link target='_blank' onClick={close} href={config.url.LOGIN} tabIndex={open ? 0 : -1}>
                <li
                    className={`flex flex-row gap-2 items-center text-[1.5rem] leading-6 overflow-hidden w-auto h-0 opacity-0 
                                pl-4 rounded-[var(--border-radius)] transition-[background-color,opacity,height,padding] duration-500
                        ${open ? 'h-[3.9rem] pt-5 pb-5 opacity-100' : ''}
                    `}
                >
                    Login
                    <ArrowUpRight className='w-6 h-6 stroke-login' />
                </li>
            </Link>
        </nav>
    )
}