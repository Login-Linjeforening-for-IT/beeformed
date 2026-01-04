'use client'

import Field from './field'

type SwitchProps = {
    name?: string
    label?: string
    value: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    className?: string
    description?: string
    error?: string
}

export default function Switch({ name, label, value, onChange, disabled = false, className = '', description, error }: SwitchProps) {
    return (
        <Field className={className} description={description} error={error}>
            <label className='flex items-center space-x-3 cursor-pointer group'>
                <div className='relative'>
                    <input
                        type='checkbox'
                        name={name}
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        disabled={disabled}
                        className='sr-only'
                    />
                    <div className={`
                        w-10 h-6 rounded-full transition-all duration-200 flex items-center px-1
                        ${value ? 'bg-login shadow-sm' : 'bg-login-600 group-hover:bg-login-500'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}>
                        <div className={`
                            w-4 h-4 rounded-full bg-login-900 transition-transform duration-200
                            ${value ? 'translate-x-4' : 'translate-x-0'}
                        `}></div>
                    </div>
                </div>
                {label && (
                    <span className={`
                        text-sm font-medium transition-colors
                        ${disabled ? 'text-login-400 cursor-not-allowed' : 'text-login-50 group-hover:text-login-100'}
                    `}>
                        {label}
                    </span>
                )}
            </label>
        </Field>
    )
}