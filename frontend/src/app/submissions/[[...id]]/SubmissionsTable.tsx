'use client'

import Table from '@components/table/table'
import { cancelSubmission } from '@utils/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'uibee/components'
import { QrCode } from 'lucide-react'

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
    async function handleCancel(row: any) {
        if (loading) return

        const isWaitlisted = row.status === 'waitlisted'
        const message = isWaitlisted
            ? 'Are you sure you want to leave the waitlist? You will lose your spot.'
            : 'Are you sure you want to cancel your submission? This cannot be undone.'

        if (confirm(message)) {
            setLoading(true)
            try {
                const res = await cancelSubmission(row.id)
                if (res && !('error' in res)) {
                    router.refresh()
                } else {
                    console.error(res)
                    toast.error('Error cancelling submission')
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
    function canCancel(row: any) {
        const expiresAt = row.expires_at
        if (!expiresAt) return true
        return new Date(expiresAt) >= new Date()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleShowQR(row: any, closeMenu: () => void) {
        router.push(`/submissions/qr/${row.id}`)
        closeMenu()
    }

    return (
        <Table
            data={data}
            columns={[
                { key: 'form_title', label: 'Form Title', sortable: true },
                { key: 'status', label: 'Status', sortable: true,
                    highlightColor: (row) => {
                        switch (row.status) {
                            case 'registered': return 'green'
                            case 'waitlisted': return 'yellow'
                            case 'cancelled': return 'gray'
                            case 'rejected': return 'red'
                            default: return 'blue'
                        }
                    }
                },
                { key: 'submitted_at', label: 'Submitted At', sortable: true }
            ]}
            disableEdit={true}
            currentOrderBy={orderBy}
            currentSort={order}
            viewBaseHref='/submissions/'
            viewHrefKey='id'
            onCancel={handleCancel}
            canCancel={canCancel}
            customActions={(row, closeMenu) => (
                <button
                    onClick={() => handleShowQR(row, closeMenu)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm
                        hover:bg-login-600 cursor-pointer`}
                >
                    <div className='flex items-center'>
                        <QrCode className='w-4 h-4 mr-2' />
                        QR Code
                    </div>
                    <span className='text-xs opacity-50 font-mono'>Q</span>
                </button>
            )}
        />
    )
}
