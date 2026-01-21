'use client'

import { Share } from 'lucide-react'
import { toast } from 'uibee/components'

export default function ShareButton({ slug }: { slug: string }) {
    function handleShare() {
        const link = `${window.location.origin}/f/${slug}`
        navigator.clipboard.writeText(link)
        toast.success('Form link copied to clipboard!')
    }

    return (
        <button
            onClick={handleShare}
            className='px-4 py-2 bg-login-700 text-login-100 hover:bg-login-600 rounded transition-colors flex items-center'
        >
            <Share className='w-4 h-4 mr-2' />
            Share
        </button>
    )
}