'use client'

import { useState } from 'react'
import { toast } from 'uibee/components'
import { updateForm } from '../actions/form'
import { Input, SwitchInput, Textarea } from 'uibee/components'
import { useRouter } from 'next/navigation'

export default function EditFormPage({ form }: { form: GetFormProps }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: form.title,
        description: form.description || '',
        anonymous_submissions: form.anonymous_submissions,
        limit: form.limit ? String(form.limit) : '',
        published_at: form.published_at ? new Date(form.published_at).toISOString().slice(0, 16) : '',
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString().slice(0, 16) : ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formDataObj = new FormData(e.target as HTMLFormElement)
            const result = await updateForm(null, formDataObj)

            if (typeof result === 'string') {
                toast.error(result)
            } else if (result && 'error' in result) {
                toast.error('Failed to update form: ' + result.error)
            } else {
                toast.success('Form updated successfully!')
                router.refresh()
            }
        } catch {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='bg-login-700 rounded-lg w-full max-w-2xl'>
            <h2 className='text-xl font-semibold text-login-50 mb-6'>Edit Form Settings</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <input type='hidden' name='id' value={form.id} />
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
                    required
                />

                <Input
                    name='expires_at'
                    type='datetime-local'
                    label='Expiration date'
                    value={formData.expires_at}
                    setValue={(value) => setFormData(prev => ({ ...prev, expires_at: value as string }))}
                    required
                />

                <div className='flex space-x-3 pt-4'>
                    <button
                        type='submit'
                        disabled={loading || !formData.title.trim() || !formData.published_at || !formData.expires_at}
                        className='flex-1 px-4 py-2 bg-login text-login-900 rounded-md
                            hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors focus:outline-none focus:ring-2 focus:ring-login
                            focus:ring-offset-2 focus:ring-offset-login-700 font-medium cursor-pointer'
                    >
                        {loading ? 'Updating...' : 'Update Form'}
                    </button>
                </div>
            </form>
        </div>
    )
}