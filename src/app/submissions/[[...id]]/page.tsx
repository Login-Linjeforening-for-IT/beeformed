import { PageContainer } from '@components/container/page'
import { getSubmission, getUserSubmissions, getPublicForm } from '@utils/api'
import { notFound } from 'next/navigation'
import Table from '@components/table/table'
import FormRenderer from '@components/form/renderer'

export default async function Page({ params }: { params: Promise<{ id?: string[] }> }) {
    const { id } = await params

    const data = id ? await getSubmission(Array.isArray(id) ? id[0] : id) : await getUserSubmissions()

    if (!data || 'error' in data) {
        notFound()
    }

    if (id) {
        const submission = data as Submission
        const formData = await getPublicForm(submission.form_id.toString())

        if (!formData || 'error' in formData) {
            notFound()
        }

        const form = { id: submission.form_id.toString(), ...formData }

        return (
            <PageContainer title='Submission Details'>
                {form.description &&
                    <div className='highlighted-section'>
                        <p>{form.description}</p>
                    </div>
                }
                <FormRenderer form={form} submission={submission} />
            </PageContainer>
        )
    } else {
        const submissions = data as GetSubmissionsProps
        const submissionsData = submissions.map(submission => ({
            ...submission,
            submitted_at: new Date(submission.submitted_at).toLocaleString(),
        }))

        return (
            <PageContainer title='My Submissions'>
                {submissionsData.length === 0 ? (
                    <p>No submissions yet.</p>
                ) : (
                    <Table
                        data={submissionsData}
                        columns={[
                            { key: 'form_title', label: 'Form Title' },
                            { key: 'form_id', label: 'Form ID' },
                            { key: 'id', label: 'Submission ID' },
                            { key: 'submitted_at', label: 'Submitted At' }
                        ]}
                        disableEdit={true}
                        viewBaseHref='/submissions/'
                        viewHrefKey='id'
                    />
                )}
            </PageContainer>
        )
    }
}