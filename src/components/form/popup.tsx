'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { postForm } from '@utils/api'
import { Input, SwitchInput, Textarea } from 'uibee/components'
import { useRouter } from 'next/navigation'

export function FormPopup({children, buttonClassName}: {children?: React.ReactNode, buttonClassName?: string}) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        is_active: true,
        anonymous_submissions: false,
        limit: '',
        published_at: '',
        expires_at: ''
    })

    const openPopup = () => setIsOpen(true)
    const closePopup = () => setIsOpen(false)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = {
                title: formData.title,
                description: formData.description || null,
                is_active: formData.is_active,
                anonymous_submissions: formData.anonymous_submissions,
                limit: formData.limit ? parseInt(formData.limit) : null,
                published_at: formData.published_at || null,
                expires_at: formData.expires_at || null
            }

            const result = await postForm(data)

            if (!result.error) {
                toast.success('Form created successfully!')
                closePopup()
                setFormData({
                    title: '',
                    description: '',
                    is_active: true,
                    anonymous_submissions: false,
                    limit: '',
                    published_at: '',
                    expires_at: ''
                })
                router.refresh()
            } else {
                toast.error('Failed to create form')
            }
        } catch {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={openPopup}
                className={`cursor-pointer ${buttonClassName}`}
            >
                {children || <Plus />}
            </button>
            {isOpen && (
                <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50' onClick={() => setIsOpen(false)}>
                    <div
                        className='bg-login-700 rounded-lg p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold text-login-50'>Create New Form</h2>
                            <button
                                onClick={closePopup}
                                className='text-login-300 hover:text-login-100 transition-colors'
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <Input
                                name='title'
                                type='text'
                                label='Title'
                                value={formData.title}
                                setValue={(value) => setFormData(prev => ({ ...prev, title: value as string }))}
                                required
                            />

                            <Textarea
                                name='description'
                                label='Description'
                                value={formData.description}
                                setValue={(value) => setFormData(prev => ({ ...prev, description: value as string }))}
                                rows={5}
                            />

                            <SwitchInput
                                name='is_active'
                                label='Active'
                                value={formData.is_active}
                                setValue={(value) => setFormData(prev => ({ ...prev, is_active: value }))}
                            />

                            <SwitchInput
                                name='anonymous_submissions'
                                label='Allow anonymous submissions'
                                value={formData.anonymous_submissions}
                                setValue={(value) => setFormData(prev => ({ ...prev, anonymous_submissions: value }))}
                            />

                            <Input
                                name='limit'
                                type='number'
                                label='Submission limit'
                                value={formData.limit}
                                setValue={(value) => setFormData(prev => ({ ...prev, limit: value as string }))}
                            />

                            <Input
                                name='published_at'
                                type='datetime-local'
                                label='Publish date'
                                value={formData.published_at}
                                setValue={(value) => setFormData(prev => ({ ...prev, published_at: value as string }))}
                            />

                            <Input
                                name='expires_at'
                                type='datetime-local'
                                label='Expiration date'
                                value={formData.expires_at}
                                setValue={(value) => setFormData(prev => ({ ...prev, expires_at: value as string }))}
                            />

                            <div className='flex space-x-3 pt-4'>
                                <button
                                    type='button'
                                    onClick={closePopup}
                                    className='flex-1 px-4 py-2 bg-login-500 rounded-md
                                        hover:bg-login-500 transition-colors focus:outline-none
                                        focus:ring-2 focus:ring-login focus:ring-offset-2
                                        focus:ring-offset-login-700 cursor-pointer'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    disabled={loading || !formData.title.trim()}
                                    className='flex-1 px-4 py-2 bg-login text-login-900 rounded-md
                                        hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-colors focus:outline-none focus:ring-2 focus:ring-login
                                        focus:ring-offset-2 focus:ring-offset-login-700 font-medium cursor-pointer'
                                >
                                    {loading ? 'Creating...' : 'Create Form'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}