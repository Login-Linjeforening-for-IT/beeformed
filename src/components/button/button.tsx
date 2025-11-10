'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ButtonProps {
    children: React.ReactNode
    onAction: () => Promise<{ error?: string }>
    errorMessage: string
    successMessage: string
    successRedirectUrl?: string
    className?: string
}

export default function Button({ children, onAction, errorMessage, successMessage, successRedirectUrl, className = '' }: ButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleClick() {
        setLoading(true)
        try {
            const result = await onAction()
            if (!result.error) {
                toast.success(successMessage)
                if (successRedirectUrl) {
                    router.push(successRedirectUrl)
                }
            } else {
                toast.error(errorMessage)
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`cursor-pointer ${loading ? 'opacity-80 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    )
}
