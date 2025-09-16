import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Version from '@components/version/version'
import Link from 'next/link'
import { LogIn } from 'lucide-react'

const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/login`

export default async function Home() {
    const Cookies = await cookies()
    const token = Cookies.get('token')?.value
    if (token) {
        redirect('/dashboard')
    }

    return (
        <main className='h-full grid place-items-center p-4 relative'>
            <div>
                <h1 className='text-2xl font-bold text-login text-center'>
                    BeeFormed
                </h1>
                <p className='mt-2 text-foreground text-center font-semibold text-login-100'>Forms Management</p>
                <Link
                    href={loginUrl}
                    className='grid place-items-center'
                >
                    <button
                        className={
                            'flex align-middle gap-2 mt-2 rounded-lg ' +
                            'bg-login px-8 py-1  hover:bg-orange-500 mb-2'
                        }
                    >
                        Login
                        <LogIn className='w-5' />
                    </button>
                </Link>
            </div>
            <Version />
        </main>
    )
}
