import { PageContainer } from '@components/container/page'
import EditFormPage from '@components/form/edit/form'
import EditFieldsPage from '@components/form/edit/fields'
import { getFields, getForm, getPermissions } from '@utils/api'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EditPermissionsPage from '@components/form/edit/permissions'

export default async function Page({ params }: { params: Promise<{ id: string, slug?: string[] | string }> }) {
    const { id, slug } = await params
    const type = Array.isArray(slug) ? slug[0] : slug || 'fields'

    const data = type === 'settings' ?
        await getForm(id) :
        type === 'permissions' ?
            await getPermissions(id) :
            await getFields(id)

    if ('error' in data) {
        notFound()
    }

    return (
        <PageContainer title={`Editing Form - ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
            <div className='flex space-x-4 mb-4'>
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
            </div>
            <div className='pt-20 pb-4 flex flex-col h-full'>
                <div className='flex justify-between mb-4'>
                    {type === 'settings' ?
                        <EditFormPage
                            form={data as GetFormProps}
                        />
                        : type === 'permissions' ?
                            <EditPermissionsPage
                                permissions={data as GetPermissionsProps}
                                formId={id}
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