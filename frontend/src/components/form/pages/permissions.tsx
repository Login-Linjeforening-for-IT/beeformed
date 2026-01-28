'use client'

import { useState } from 'react'
import { toast } from 'uibee/components'
import { deletePermission, postPermission } from '@utils/api'
import { Input } from 'uibee/components'
import Table from '@components/table/table'
import { useRouter } from 'next/navigation'

export default function EditPermissionsPage({ permissions, formId }: { permissions: GetPermissionsProps, formId: string }) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        group: ''
    })

    const userFilled = !!formData.email.trim()
    const groupFilled = !!formData.group.trim()
    const bothFilled = userFilled && groupFilled
    const neitherFilled = !userFilled && !groupFilled

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await postPermission(formId, {
                user_email: formData.email || null,
                group: formData.group || null
            })

            if (!result || 'error' in result) {
                toast.error('Failed to add permission')
            } else {
                toast.success('Permission added successfully!')
                setFormData({ email: '', group: '' })
                router.refresh()
            }
        } catch {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    function handleDeletePermission(formId: string, permissionId: string) {
        deletePermission(formId, permissionId)
            .then((result) => {
                if (!result || 'error' in result) {
                    toast.error('Failed to delete permission')
                } else {
                    toast.success('Permission deleted successfully!')
                    router.refresh()
                }
            })
            .catch(() => {
                toast.error('An unexpected error occurred')
            })
    }

    const columns = [
        { key: 'user_or_group', label: 'User/Group' },
        { key: 'granted_by_email', label: 'Granted By' },
        { key: 'created_at', label: 'Created At' }
    ]

    const transformedData = permissions.data.map(perm => ({
        ...perm,
        user_or_group: perm.user_email || perm.group
    }))

    return (
        <div className='space-y-6 w-full min-w-0'>
            <div className='w-full max-w-2xl'>
                <h2 className='text-xl font-semibold text-login-50 mb-6'>Add Permission</h2>
                <p className='text-login-200 mb-6'>
                    Adding permissions grants users or groups the ability to edit the form and manage submissions.
                </p>

                <form onSubmit={handleSubmit}>
                    <Input
                        name='email'
                        type='text'
                        label='Email'
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />

                    <Input
                        name='group'
                        type='text'
                        label='Group'
                        value={formData.group}
                        onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                    />

                    {bothFilled && (
                        <p className='text-red-400 text-sm'>Email or Group, not both.</p>
                    )}

                    <div className='flex space-x-3 pt-4'>
                        <button
                            type='submit'
                            disabled={loading || neitherFilled || bothFilled}
                            className='flex-1 px-4 py-2 bg-login text-login-900 rounded-md
                                hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed
                                transition-colors focus:outline-none focus:ring-2 focus:ring-login
                                focus:ring-offset-2 focus:ring-offset-login-700 font-medium cursor-pointer'
                        >
                            {loading ? 'Adding...' : 'Add Permission'}
                        </button>
                    </div>
                </form>
            </div>

            <div className='w-full max-w-2xl'>
                <h2 className='text-xl font-semibold text-login-50 mb-6'>Current Permissions</h2>

                {permissions && permissions.data.length > 0 ? (
                    <Table
                        data={transformedData}
                        columns={columns}
                        onDelete={(row) => handleDeletePermission(formId, row.id as string)}
                        disableEdit
                    />
                ) : (
                    <p className='text-login-200'>No permissions found.</p>
                )}
            </div>
        </div>
    )
}