'use client'

import Field, { baseInputClasses } from './field'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string
    error?: string
    description?: string
}

export default function Textarea({ label, error, description, className = '', ...props }: TextareaProps) {
    const baseTextareaClasses = `${baseInputClasses} resize-vertical min-h-[80px]`

    const errorClasses = error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : ''

    return (
        <Field
            label={label}
            description={description}
            error={error}
            required={props.required}
        >
            <textarea
                className={`${baseTextareaClasses} ${errorClasses} ${className}`}
                {...props}
            />
        </Field>
    )
}
