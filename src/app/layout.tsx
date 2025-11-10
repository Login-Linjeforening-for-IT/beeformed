import type { Metadata } from 'next'
import 'uibee/styles'
import './globals.css'
import { cookies } from 'next/headers'
import Navbar from '@components/navbar/navbar'
import { Toaster } from 'sonner'
import localFont from 'next/font/local'

export const metadata: Metadata = {
    title: 'BeeFormed',
    description: 'Form management system',
}

const poppins = localFont({
    src: './poppins.ttf',
})

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'

    return (
        <html lang='en' className={`${theme} ${poppins.className} h-full`}>
            <body className='bg-login-800 h-full flex flex-col'>
                <header className='w-full bg-[#1e1e1e99] backdrop-blur-md h-fit'>
                    <Navbar />
                </header>
                <main className='flex-1 flex overflow-hidden pt-22 w-full bg-login-800'>
                    {children}
                </main>
                <Toaster />
            </body>
        </html>
    )
}
