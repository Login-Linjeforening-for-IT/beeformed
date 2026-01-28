'use client'

type FieldProps = {
    label?: string
    error?: string
    description?: string
    required?: boolean
    children: React.ReactNode
    className?: string
}

export const baseInputClasses = `
    w-full px-3 py-2
    bg-login-800
    border border-login-300
    rounded-md
    text-login-50
    placeholder-login-300
    focus:outline-none
    focus:ring-1
    focus:ring-login-100
    focus:border-login-100
    transition-colors
    disabled:opacity-50
    disabled:cursor-not-allowed
`

export default function Field({
    label,
    error,
    description,
    required,
    children,
    className = ''
}: FieldProps) {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className='block text-lg font-medium text-login-50'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}
            {description && (
                <p className='text-md text-login-100'>{description}</p>
            )}
            {children}
            {error && (
                <p className='text-sm text-red-500'>{error}</p>
            )}
        </div>
    )
}