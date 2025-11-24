'use client'

import { Check } from 'lucide-react'
import Field from './field'

type ChoiceProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    error?: string
    description?: string
    options?: string[]
    currentValue?: string | string[]
}

export default function Choice({ label, error, description, options, currentValue, className = '', ...props }: ChoiceProps) {
    const isRadio = props.type === 'radio'
    const isCheckbox = props.type === 'checkbox'

    if (!isRadio && !isCheckbox) {
        throw new Error('Choice component only supports radio and checkbox types')
    }

    if (options && options.length > 0) {
        return (
            <Field
                error={error}
                label={label}
                description={description}
                required={props.required}
                className={className}
            >
                <div className='space-y-2'>
                    {options.map((option: string) => {
                        const isChecked = Array.isArray(currentValue) ? currentValue.includes(option) : currentValue === option
                        return (
                            <label key={option} className='flex items-center space-x-3 cursor-pointer group'>
                                <div className='relative'>
                                    <input
                                        className='sr-only'
                                        {...props}
                                        value={option}
                                        checked={isChecked}
                                    />
                                    <div className={`${
                                        isRadio ? 'w-4 h-4 rounded-full' : 'w-4 h-4 rounded'
                                    } border-2 transition-all duration-200 flex items-center justify-center ${
                                        isChecked
                                            ? 'border-login bg-login shadow-sm'
                                            : 'border-login-500 bg-login-800 group-hover:border-login-300'
                                    } ${
                                        props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                    }`}>
                                        {isChecked && (
                                            isRadio ? (
                                                <div className='w-2 h-2 rounded-full bg-login-900'></div>
                                            ) : (
                                                <Check className='w-3 h-3 text-login-900' />
                                            )
                                        )}
                                    </div>
                                </div>
                                <span className={`
                                    text-sm font-medium transition-colors
                                    ${props.disabled ? 'text-login-400 cursor-not-allowed' : 'text-login-75 group-hover:text-login-50'}
                                `}>
                                    {option}
                                </span>
                            </label>
                        )
                    })}
                </div>
            </Field>
        )
    } else {
        return null
    }
}