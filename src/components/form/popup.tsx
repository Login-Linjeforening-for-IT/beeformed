'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'uibee/components'
import { postForm } from '@utils/api'
import { Input, Switch, Textarea } from 'uibee/components'
import { useRouter } from 'next/navigation'

export function FormPopup({children, buttonClassName}: {children?: React.ReactNode, buttonClassName?: string}) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        anonymous_submissions: false,
        limit: '',
        published_at: '',
        expires_at: ''
    })

    function openPopup() {
        setIsOpen(true)
    }

    function closePopup() {
        setIsOpen(false)
    }

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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const data = {
                title: formData.title,
                description: formData.description || null,
                anonymous_submissions: formData.anonymous_submissions,
                limit: formData.limit ? parseInt(formData.limit) : null,
                published_at: formData.published_at,
                expires_at: formData.expires_at
            }

            const result = await postForm(data)

            if (!('error' in result)) {
                toast.success('Form created successfully!')
                closePopup()
                setFormData({
                    title: '',
                    description: '',
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

                        <form onSubmit={handleSubmit}>
                            <Input
                                name='title'
                                type='text'
                                label='Title'
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />

                            <Textarea
                                name='description'
                                label='Description'
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={5}
                            />


                            <Switch
                                name='anonymous_submissions'
                                label='Allow anonymous submissions'
                                checked={formData.anonymous_submissions}
                                onChange={(e) => setFormData(prev => ({ ...prev, anonymous_submissions: e.target.checked }))}
                            />

                            <Input
                                name='limit'
                                type='number'
                                label='Submission limit'
                                value={formData.limit}
                                onChange={(e) => setFormData(prev => ({ ...prev, limit: e.target.value }))}
                            />

                            <Input
                                name='published_at'
                                type='datetime-local'
                                label='Publish date'
                                value={formData.published_at}
                                onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                                required
                            />

                            <Input
                                name='expires_at'
                                type='datetime-local'
                                label='Expiration date'
                                value={formData.expires_at}
                                onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                                required
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
                                    disabled={loading || !formData.title.trim() || !formData.published_at || !formData.expires_at}
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