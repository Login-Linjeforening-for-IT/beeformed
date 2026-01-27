'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'uibee/components'

interface ButtonProps {
    children: React.ReactNode
    onAction?: () => void | Promise<{ error?: string }>
    errorMessage?: string
    successMessage?: string
    href?: string
    leadingIcon?: React.ReactNode
    className?: string
}

export default function Button({ children, onAction, errorMessage, successMessage, href, leadingIcon, className = '' }: ButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleAction() {
        setLoading(true)
        try {
            if (onAction) {
                const result = await onAction()
                if (result && result.error) {
                    if (errorMessage) toast.error(errorMessage)
                } else {
                    if (successMessage) toast.success(successMessage)
                    if (href) {
                        router.push(href)
                    }
                }
            } else {
                if (href) {
                    router.push(href)
                }
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (href) {
        return (
            <a
                href={href}
                onClick={(e) => {
                    e.preventDefault()
                    handleAction()
                }}
                className={`flex flex-row gap-2 items-center cursor-pointer
                    ${loading ? 'opacity-80 cursor-not-allowed pointer-events-none' : ''}
                    ${className}`
                }
            >
                {leadingIcon} {children}
            </a>
        )
    }

    return (
        <button
            onClick={handleAction}
            disabled={loading}
            className={`flex flex-row gap-2 items-center cursor-pointer
                ${loading ? 'opacity-80 cursor-not-allowed' : ''}
                ${className}`
            }
        >
            {leadingIcon} {children}
        </button>
    )
}
