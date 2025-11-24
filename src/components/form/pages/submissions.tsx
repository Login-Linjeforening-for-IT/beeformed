'use client'

import Table from '@components/table/table'

type SubmissionsPageProps = {
    submissions: Submission[]
}

export default function SubmissionsPage({ submissions }: SubmissionsPageProps) {
    const submissionsData = submissions.map(submission => ({
        ...submission,
        submitted_at: new Date(submission.submitted_at).toLocaleString(),
        user_email: submission.user_email || 'Anonymous',
        user_name: submission.user_name || 'Anonymous'
    }))

    return (
        <div className='w-full'>
            <Table
                data={submissionsData}
                columns={[
                    { key: 'id', label: 'ID' },
                    { key: 'form_title', label: 'Form Title' },
                    { key: 'submitted_at', label: 'Submitted At' },
                    { key: 'user_email', label: 'User Email' },
                    { key: 'user_name', label: 'User Name' }
                ]}
                disableEdit={true}
                viewBaseHref='/submissions/'
                viewHrefKey='id'
            />
        </div>
    )
}