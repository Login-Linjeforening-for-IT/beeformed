'use client'

import config from '@config'
import Button from '@components/button/button'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFoundPage() {
    const router = useRouter()

    return (
        <div className='py-16 px-4 max-w-160 m-auto 800px:flex 800px:items-center 800px:justify-around 800px:max-w-[75rem] 800px:gap-8'>
            <div className='block w-full max-w-[40rem] m-auto'>
                <Image
                    src={`${config.url.CDN_URL}/img/pizza404.png`}
                    className='not-block w-full max-w-[40rem] m-auto' alt='Hangry 404'
                    width={1508}
                    height={1200}
                />
            </div>
            <div className='block w-full mt-4 800px:w-fit 800px:m-auto 800px:text-left 800px:pr-[1rem]'>
                <h1 className='text-[2rem]'>It's empty here...</h1>
                <p className='p--regular'>
                    This site does not exist. This will not be fixed until TekKom gets more pizza...
                </p>
                <Button
                    onAction={async () => { router.back(); return {} }}
                    leadingIcon={<ArrowLeft className='' />}
                    className='bg-login/90 w-fit py-1.5 px-2 my-4 rounded-md'
                >
                    Go back
                </Button>
            </div>
        </div>
    )
}
