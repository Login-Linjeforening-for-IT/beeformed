import type { Metadata } from 'next'
import 'uibee/styles'
import './globals.css'
import { cookies } from 'next/headers'
import TopBar from '@components/navbar/topbar'

export const metadata: Metadata = {
    title: 'BeeFormed',
    description: 'Form management system',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'
    
    return (
        <html lang='en' className={`${theme} h-full`}>
            <body className='bg-login-700 h-full flex flex-col'>
                <div className="flex flex-col min-h-screen">
                    <header className='w-full bg-[#1e1e1e99] backdrop-blur-md'>
                        <TopBar />
                    </header>
                    <main className='flex-1 flex overflow-hidden'>
                        <div className='w-full bg-login-800'>{children}</div>
                    </main>
                </div>
            </body>
        </html>
    )
}
