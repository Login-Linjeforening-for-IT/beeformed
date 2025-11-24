'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { submitForm } from '@utils/api'
import CustomInput from '../inputs/input'
import CustomTextarea from '../inputs/textarea'
import CustomSelect from '../inputs/select'
import CustomSwitch from '../inputs/switch'
import CustomChoice from '../inputs/choice'

interface FormField {
    id: string
    field_type: string
    title: string
    description: string | null
    required: boolean
    options: string[] | null
    validation: Record<string, unknown> | null
    field_order: number
}

interface FormData {
    id: string
    title: string
    description: string | null
    creator_name: string
    creator_email: string
    fields: FormField[]
}

export default function FormRenderer({ form }: { form: FormData }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const fields = form.fields.map(field => ({
                field_id: parseInt(field.id),
                value: formData[field.id] || ''
            }))

            const result = await submitForm(form.id, { fields })

            if ('error' in result) {
                toast.error(result.error)
            } else {
                toast.success('Form submitted successfully!')
                // Reset form
                setFormData({})
            }
        } catch {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const renderField = (field: FormField) => {
        const value = formData[field.id] || ''
        const setValue = (newValue: string | number) => {
            setFormData(prev => ({ ...prev, [field.id]: String(newValue) }))
        }

        switch (field.field_type) {
            case 'text':
                return (
                    <CustomInput
                        name={field.id}
                        type='text'
                        label={field.title}
                        description={field.description || undefined}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required={field.required}
                    />
                )
            case 'textarea':
                return (
                    <CustomTextarea
                        name={field.id}
                        label={field.title}
                        description={field.description || undefined}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required={field.required}
                        rows={4}
                    />
                )
            case 'number':
                return (
                    <CustomInput
                        name={field.id}
                        type='number'
                        label={field.title}
                        description={field.description || undefined}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required={field.required}
                    />
                )
            case 'select': {
                const choices = Array.isArray(field.options) ? field.options : []
                const selectOptions = choices.map((choice: string) => ({
                    value: choice,
                    label: choice
                }))
                return (
                    <CustomSelect
                        name={field.id}
                        label={field.title}
                        description={field.description || undefined}
                        value={value}
                        onChange={(e) => setValue((e.target as HTMLSelectElement).value)}
                        options={selectOptions}
                        required={field.required}
                        searchable={choices.length > 5}
                    />
                )
            }
            case 'radio': {
                const radioOptions = Array.isArray(field.options) ? field.options : []
                return (
                    <CustomChoice
                        type='radio'
                        name={field.id}
                        label={field.title}
                        description={field.description || undefined}
                        options={radioOptions}
                        currentValue={value}
                        onChange={(e) => setValue((e.target as HTMLInputElement).value)}
                        required={field.required}
                    />
                )
            }
            case 'checkbox': {
                if (field.options && Array.isArray(field.options)) {
                    const checkboxOptions = field.options
                    const selectedValues = value ? value.split(',') : []
                    return (
                        <CustomChoice
                            type='checkbox'
                            label={field.title}
                            description={field.description || undefined}
                            options={checkboxOptions}
                            currentValue={selectedValues}
                            onChange={(e) => {
                                const val = (e.target as HTMLInputElement).value
                                const newSelected = selectedValues.includes(val)
                                    ? selectedValues.filter(v => v !== val)
                                    : [...selectedValues, val]
                                setValue(newSelected.join(','))
                            }}
                            required={field.required}
                        />
                    )
                } else {
                    return (
                        <CustomSwitch
                            name={field.id}
                            label={field.title}
                            description={field.description || undefined}
                            value={value === 'true'}
                            onChange={(checked) => setValue(checked ? 'true' : 'false')}
                        />
                    )
                }
            }
            case 'date': {
                return (
                    <CustomInput
                        name={field.id}
                        type='date'
                        label={field.title}
                        description={field.description || undefined}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required={field.required}
                    />
                )
            }
            case 'time': {
                return (
                    <CustomInput
                        name={field.id}
                        type='time'
                        label={field.title}
                        description={field.description || undefined}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required={field.required}
                    />
                )
            }
            case 'datetime': {
                return (
                    <CustomInput
                        name={field.id}
                        type='datetime-local'
                        label={field.title}
                        description={field.description || undefined}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required={field.required}
                    />
                )
            }
            default: {
                return (
                    <CustomInput
                        name={field.id}
                        type='text'
                        label={field.title}
                        description={field.description || undefined}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required={field.required}
                    />
                )
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            {form.fields
                .sort((a, b) => a.field_order - b.field_order)
                .map(field => (
                    <div key={field.id} className='max-w-2xl'>
                        {renderField(field)}
                    </div>
                ))}

            <div className='max-w-2xl'>
                <button
                    type='submit'
                    disabled={loading}
                    className='w-full px-4 py-3 bg-login text-login-900 rounded-md
                        hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors focus:outline-none focus:ring-2 focus:ring-login
                        focus:ring-offset-2 focus:ring-offset-login-700 font-medium cursor-pointer'
                >
                    {loading ? 'Submitting...' : 'Submit Form'}
                </button>
            </div>
        </form>
    )
}