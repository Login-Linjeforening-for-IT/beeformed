'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { updateFields } from '../actions/field'
import { Input, SwitchInput, Select } from 'uibee/components'
import { GripVertical, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EditFieldsPage({ fields, formId }: { fields: GetFieldsProps; formId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fieldsData, setFieldsData] = useState(fields)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const lastReorderRef = useRef<number | null>(null)

    const fieldTypeOptions = [
        { value: 'text', label: 'Text' },
        { value: 'textarea', label: 'Textarea' },
        { value: 'number', label: 'Number' },
        { value: 'select', label: 'Select' },
        { value: 'checkbox', label: 'Checkbox' },
        { value: 'radio', label: 'Radio' },
        { value: 'date', label: 'Date' },
        { value: 'time', label: 'Time' },
        { value: 'datetime', label: 'DateTime' }
    ]

    const handleDragStart = (index: number) => {
        setDraggedIndex(index)
        lastReorderRef.current = null
    }

    const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === targetIndex || lastReorderRef.current === targetIndex) return

        lastReorderRef.current = targetIndex
        const newFields = [...fieldsData]
        const [draggedField] = newFields.splice(draggedIndex, 1)
        newFields.splice(targetIndex, 0, draggedField)

        newFields.forEach((field, i) => {
            field.field_order = i + 1
        })

        setFieldsData(newFields)
        setDraggedIndex(targetIndex)
    }

    const handleDrop = () => {
        setDraggedIndex(null)
        lastReorderRef.current = null
    }

    const handleAddField = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newField: any = {
            id: null,
            label: '',
            field_type: 'text',
            required: false,
            options: null,
            validation: null,
            field_order: fieldsData.length + 1,
            operation: 'create'
        }
        setFieldsData(prev => [...prev, newField])
    }

    const handleAddFieldAt = (position: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newField: any = {
            id: null,
            label: '',
            field_type: 'text',
            required: false,
            options: null,
            validation: null,
            field_order: position + 1,
            operation: 'create'
        }
        setFieldsData(prev => {
            const newFields = [...prev]
            newFields.splice(position, 0, newField)
            // Update field_order for all
            newFields.forEach((field, i) => {
                field.field_order = i + 1
            })
            return newFields
        })
    }

    const handleRemove = (index: number) => {
        setFieldsData(prev => prev.map((f, i) => i === index ? { ...f, deleted: true } : f))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formDataObj = new FormData(e.target as HTMLFormElement)
            const result = await updateFields(null, formDataObj)

            if (typeof result === 'string') {
                toast.error(result)
            } else if (result && 'error' in result) {
                toast.error('Failed to update fields')
            } else {
                toast.success('Fields updated successfully!')
                router.refresh()
            }
        } catch {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                    e.preventDefault()
                }
            }}
            className='w-full'
        >
            <input type='hidden' name='formId' value={formId} />
            {fieldsData.map((field, index) => {
                if ((field as { deleted?: boolean }).deleted) {
                    return (
                        <div key={index} style={{ display: 'none' }}>
                            <input type='hidden' name={`field_${index}_id`} value={field.id} />
                            <input type='hidden' name={`field_${index}_operation`} value='delete' />
                        </div>
                    )
                }

                return [
                    <div
                        key={index}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={handleDrop}
                        className={`p-4 border border-login-500 rounded-xl bg-login-700 space-y-8 ${
                            draggedIndex === index ? 'opacity-50' : ''
                        }`}
                    >
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='font-semibold text-login-50'>Field {index + 1}</h3>
                            <div className='flex space-x-2'>
                                <button
                                    type='button'
                                    onClick={() => handleRemove(index)}
                                    className='text-red-500 cursor-pointer hover:bg-login-600 p-1 rounded transition-colors'
                                >
                                    <X size={16} />
                                </button>
                                <button
                                    type='button'
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    className='text-login-50 cursor-move hover:bg-login-600 p-1 rounded transition-colors'
                                >
                                    <GripVertical size={16} />
                                </button>
                            </div>
                        </div>
                        {field.id && <input type='hidden' name={`field_${index}_id`} value={field.id} />}
                        <input
                            type='hidden'
                            name={`field_${index}_operation`}
                            value={(field as { operation?: string }).operation || 'update'}
                        />
                        <div className='grid grid-cols-4 gap-4'>
                            <Input
                                name={`field_${index}_label`}
                                type='text'
                                label='Label'
                                value={field.label}
                                setValue={(value) =>
                                    setFieldsData(prev => prev.map((f, i) => i === index ? { ...f, label: value as string } : f))}
                                required
                                className='col-span-2'
                            />

                            <Select
                                name={`field_${index}_field_type`}
                                label='Field Type'
                                value={field.field_type}
                                setValue={(value) =>
                                    setFieldsData(prev => prev.map((f, i) => i === index ? { ...f, field_type: value as string } : f))
                                }
                                options={fieldTypeOptions}
                                required
                            />

                            <SwitchInput
                                name={`field_${index}_required`}
                                label='Required'
                                value={field.required}
                                setValue={(value) => setFieldsData(prev => prev.map((f, i) => i === index ? { ...f, required: value } : f))}
                            />
                        </div>

                        {(field.field_type === 'select' || field.field_type === 'checkbox' || field.field_type === 'radio') && (
                            <div>
                                <label className='block text-sm font-medium text-login-50 mb-2'>Options (one per line)</label>
                                <textarea
                                    name={`field_${index}_options`}
                                    value={Array.isArray(field.options) ? field.options.join('\n') : ''}
                                    onChange={(e) => {
                                        const choices = e.target.value.split('\n').map((s: string) => s.trim())
                                        setFieldsData(prev => prev.map((f, i) => i === index ? { ...f, options: choices } : f))
                                    }}
                                    rows={3}
                                    className='w-full px-3 py-2 border border-login-500 rounded-md bg-login-700
                                        text-login-50 focus:outline-none focus:ring-2 focus:login-50 focus:border-transparent'
                                />
                            </div>
                        )}

                        <input type='hidden' name={`field_${index}_field_order`} value={field.field_order} />
                    </div>,
                    <div key={`add-${index}`} className='flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-200'>
                        <button
                            type='button'
                            onClick={() => handleAddFieldAt(index + 1)}
                            className='text-login-50 hover:text-login-300 text-2xl cursor-pointer
                                rounded-full w-8 h-8 flex items-center justify-center hover:bg-login-600 transition-colors'
                        >
                            +
                        </button>
                    </div>
                ]

            })}

            <div className='flex space-x-3 pt-4'>
                <button
                    type='button'
                    onClick={handleAddField}
                    className='px-4 py-2 bg-login-500  rounded-md transition-colors'
                >
                    Add Field
                </button>
                <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 px-4 py-2 bg-login text-login-900 rounded-md
                        hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors focus:outline-none focus:ring-2 focus:ring-login
                        focus:ring-offset-2 focus:ring-offset-login-700 font-medium cursor-pointer'
                >
                    {loading ? 'Updating...' : 'Update Fields'}
                </button>
            </div>
        </form>
    )
}