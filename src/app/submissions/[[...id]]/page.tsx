import { PageContainer } from '@components/container/page'
import { getSubmission, getUserSubmissions, getPublicForm } from '@utils/api'
import { notFound } from 'next/navigation'
import Table from '@components/table/table'
import SearchInput from '@components/search/search'
import Pagination from '@components/pagination/pagination'
import FormRenderer from '@components/form/renderer'

export default async function Page(
    { params, searchParams }: { params: Promise<{ id?: string[] }>; searchParams: Promise<{ [key: string]: string | undefined }> }
) {
    const { id } = await params
    const filters = await searchParams

    const orderBy = typeof filters.column === 'string' ? filters.column : 'submitted_at'
    const order = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc') ? filters.order : 'desc'
    const data = id ? await getSubmission(Array.isArray(id) ? id[0] : id) : await getUserSubmissions({
        search: typeof filters.q === 'string' ? filters.q : '',
        offset: typeof filters.page === 'string' ? (Number(filters.page) - 1) * 14 : undefined,
        limit: 14,
        orderBy,
        sort: order
    })

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
        const submissionsData = submissions.data.map(submission => ({
            ...submission,
            submitted_at: new Date(submission.submitted_at).toLocaleString(),
        }))
        const totalItems = submissions.total

        return (
            <PageContainer title='My Submissions'>
                <div className='pt-20 pb-4 flex flex-col h-full'>
                    <div className='flex flex-1 flex-col min-h-0 overflow-hidden'>
                        <div className='flex justify-between mb-4'>
                            <SearchInput placeholder='Search submissions...' />
                        </div>
                        <div className='flex-1 overflow-auto'>
                            {submissionsData.length === 0 ? (
                                <div className='flex items-center justify-center h-full'>
                                    <p>No submissions yet.</p>
                                </div>
                            ) : (
                                <Table
                                    data={submissionsData}
                                    columns={[
                                        { key: 'form_title', label: 'Form Title', sortable: true },
                                        { key: 'form_id', label: 'Form ID' },
                                        { key: 'id', label: 'Submission ID', sortable: true },
                                        { key: 'submitted_at', label: 'Submitted At', sortable: true }
                                    ]}
                                    disableEdit={true}
                                    currentOrderBy={orderBy}
                                    currentSort={order}
                                    viewBaseHref='/submissions/'
                                    viewHrefKey='id'
                                />
                            )}
                        </div>
                        <div className='mt-4'>
                            <Pagination pageSize={14} totalRows={totalItems} />
                        </div>
                    </div>
                </div>
            </PageContainer>
        )
    }
}