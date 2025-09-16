import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function Navigation() {

    return (
    <nav className='hidden 800px:flex 800px:justify-between 800px:items-center 800px:w-fill max-w-[40rem]'>
            <Link href='https://login.no' className='flex items-center'>
                <li className='flex items-center list-none no-underline text-lg leading-4 p-3 px-1 font-medium cursor-pointer link--corner-hover'>
                    Login
                    <ArrowUpRight className='w-6 h-6 stroke-login'/>
                </li>
            </Link>
        </nav>
    )
}
