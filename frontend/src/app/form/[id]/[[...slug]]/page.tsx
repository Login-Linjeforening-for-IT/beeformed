import { PageContainer } from '@components/container/page'
import EditFormPage from '@components/form/pages/form'
import EditFieldsPage from '@components/form/pages/fields'
import { getFields, getForm, getPermissions, getSubmissions } from '@utils/api'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EditPermissionsPage from '@components/form/pages/permissions'
import SubmissionsPage from '@components/form/pages/submissions'
import ShareButton from '@components/share-button'

type PageProps = {
    params: Promise<{ id: string, slug?: string[] | string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
    const { id, slug } = await params
    const filters = await searchParams
    const type = Array.isArray(slug) ? slug[0] : slug || 'fields'

    const orderBy = typeof filters.column === 'string' ? filters.column : 'submitted_at'
    const sort = (typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')) ? filters.order : 'desc'

    const filter = {
        search: typeof filters.q === 'string' ? filters.q : '',
        offset: typeof filters.page === 'string' ? (Number(filters.page) - 1) * 14 : 0,
        limit: 14,
        orderBy,
        sort: sort as 'asc' | 'desc'
    }

    const data = type === 'settings' ?
        await getForm(id) :
        type === 'permissions' ?
            await getPermissions(id) :
            type === 'submissions' ?
                await getSubmissions(id, filter) :
                await getFields(id)

    const formData = await getForm(id)

    if (!data || 'error' in data || !formData || 'error' in formData) {
        notFound()
    }

    return (
        <PageContainer title={`Editing Form - ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
            <div className='flex flex-wrap gap-2 mb-4'>
                <Link
                    href={`/form/${id}/fields`}
                    className={`px-4 py-2 rounded transition-colors ${
                        type === 'fields'
                            ? 'bg-login text-white'
                            : 'bg-login-700 text-login-100 hover:bg-login-600'
                    }`}
                >
                    Fields
                </Link>
                <Link
                    href={`/form/${id}/settings`}
                    className={`px-4 py-2 rounded transition-colors ${
                        type === 'settings'
                            ? 'bg-login text-white'
                            : 'bg-login-700 text-login-100 hover:bg-login-600'
                    }`}
                >
                    Settings
                </Link>
                <Link
                    href={`/form/${id}/permissions`}
                    className={`px-4 py-2 rounded transition-colors ${
                        type === 'permissions'
                            ? 'bg-login text-white'
                            : 'bg-login-700 text-login-100 hover:bg-login-600'
                    }`}
                >
                    Permissions
                </Link>
                <Link
                    href={`/form/${id}/submissions`}
                    className={`px-4 py-2 rounded transition-colors ${
                        type === 'submissions'
                            ? 'bg-login text-white'
                            : 'bg-login-700 text-login-100 hover:bg-login-600'
                    }`}
                >
                    Submissions
                </Link>
                <Link
                    href={`/qr/${id}`}
                    className={`px-4 py-2 rounded transition-colors ${
                        type === 'qr'
                            ? 'bg-login text-white'
                            : 'bg-login-700 text-login-100 hover:bg-login-600'
                    }`}
                >
                    QR Scanner
                </Link>
                <ShareButton slug={formData.slug} />
            </div>
            <div className='pt-20 pb-4 flex flex-col h-full'>
                <div className='flex justify-between mb-4 h-full'>
                    {type === 'settings' ?
                        <EditFormPage
                            form={data as GetFormProps}
                        />
                        : type === 'permissions' ?
                            <EditPermissionsPage
                                permissions={data as GetPermissionsProps}
                                formId={id}
                            />
                            : type === 'submissions' ?
                                <SubmissionsPage
                                    submissions={data as GetSubmissionsProps}
                                    currentOrderBy={filter.orderBy}
                                    currentSort={filter.sort}
                                />
                                :
                                <EditFieldsPage
                                    fields={data as GetFieldsProps}
                                    formId={id}
                                />
                    }
                </div>
            </div>
        </PageContainer>
    )
}