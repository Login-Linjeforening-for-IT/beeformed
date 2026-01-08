'use client'

import Table from '@components/table/table'
import { deleteSubmission } from '@utils/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'uibee/components'

interface SubmissionsTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
    orderBy: string
    order: 'asc' | 'desc'
}

export default function SubmissionsTable({ data, orderBy, order }: SubmissionsTableProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function handleDelete(row: any) {
        if (loading) return

        const isWaitlisted = row.status === 'waitlisted'
        const message = isWaitlisted
            ? 'Are you sure you want to leave the waitlist? You will lose your spot.'
            : 'Are you sure you want to delete your submission? This cannot be undone.'

        if (confirm(message)) {
            setLoading(true)
            try {
                const res = await deleteSubmission(row.id)
                if (res && !('error' in res)) {
                    router.refresh()
                } else {
                    console.error(res)
                    toast.error('Error deleting submission')
                }
            } catch (e) {
                console.error(e)
                toast.error('An error occurred')
            } finally {
                setLoading(false)
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function canDelete(row: any) {
        const expiresAt = row.expires_at
        if (!expiresAt) return true
        return new Date(expiresAt) >= new Date()
    }

    return (
        <Table
            data={data}
            columns={[
                { key: 'form_title', label: 'Form Title', sortable: true },
                { key: 'form_id', label: 'Form ID' },
                { key: 'id', label: 'Submission ID', sortable: true },
                { key: 'status', label: 'Status', sortable: true,
                    highlightColor: (row) => row.status === 'waitlisted' ? 'red' : 'green'
                },
                { key: 'submitted_at', label: 'Submitted At', sortable: true }
            ]}
            disableEdit={true}
            currentOrderBy={orderBy}
            currentSort={order}
            viewBaseHref='/submissions/'
            viewHrefKey='id'
            onDelete={handleDelete}
            canDelete={canDelete}
        />
    )
}
