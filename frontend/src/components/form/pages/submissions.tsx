'use client'

import Table from '@components/table/table'
import SearchInput from '@components/search/search'
import Pagination from '@components/pagination/pagination'

type SubmissionsPageProps = {
    submissions: GetSubmissionsProps
    currentOrderBy?: string
    currentSort?: 'asc' | 'desc'
}

export default function SubmissionsPage({ submissions, currentOrderBy, currentSort }: SubmissionsPageProps) {
    const submissionsData = submissions.data.map(submission => ({
        ...submission,
        submitted_at: new Date(submission.submitted_at).toLocaleString(),
        user_email: submission.user_email || 'Anonymous',
        user_name: submission.user_name || 'Anonymous'
    }))

    return (
        <div className='pt-20 pb-4 flex flex-col w-full h-full'>
            <div className='flex justify-between mb-4'>
                <SearchInput placeholder='Search submissions...' />
            </div>
            {submissionsData.length === 0 ? (
                <div className='flex-1 flex flex-col items-center justify-center min-h-0'>
                    <p className='text-gray-500 text-center'>
                        No submissions found
                    </p>
                </div>
            ) : (
                <div className='flex-1 flex flex-col justify-between min-h-0'>
                    <Table
                        data={submissionsData}
                        columns={[
                            { key: 'id', label: 'ID', sortable: true },
                            { key: 'form_title', label: 'Form Title', sortable: true },
                            { key: 'submitted_at', label: 'Submitted At', sortable: true },
                            { key: 'user_email', label: 'User Email' },
                            { key: 'user_name', label: 'User Name' },
                            { key: 'status', label: 'Status', sortable: true,
                                highlightColor: (row) => row.status === 'waitlisted' ? 'red' : 'green'
                            }
                        ]}
                        disableEdit={true}
                        currentOrderBy={currentOrderBy}
                        currentSort={currentSort}
                        viewBaseHref='/submissions/'
                        viewHrefKey='id'
                    />
                    <Pagination pageSize={14} totalRows={submissions.total} />
                </div>
            )}
        </div>
    )
}