'use client'

import Field, { baseInputClasses } from './field'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    error?: string
    description?: string
}

export default function Input({ label, error, description, className = '', ...props }: InputProps) {
    const errorClasses = error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : ''

    return (
        <Field
            label={label}
            error={error}
            description={description}
            required={props.required}
        >
            <input
                className={`${baseInputClasses} ${errorClasses} ${className}`}
                {...props}
            />
        </Field>
    )
}
