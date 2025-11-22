import { PageContainer } from '@components/container/page'
import EditFormPage from '@components/form/edit/form'
import EditFieldsPage from '@components/form/edit/fields'
import { getFields, getForm } from '@utils/api'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function Page({ params }: { params: Promise<{ id: string, slug?: string[] | string }> }) {
    const { id, slug } = await params
    const type = Array.isArray(slug) ? slug[0] : slug || 'fields'

    const data = type === 'settings' ? await getForm(id) : await getFields(id)

    if ('error' in data) {
        notFound()
    }

    return (
        <PageContainer title={`Editing Form - ${type === 'settings' ? 'Settings' : 'Fields'}`}>
            <div>
                <Link
                    href={type === 'settings' ? `/form/${id}/fields` : `/form/${id}/settings`}
                    className='flex items-center gap-1 hover:gap-2 text-xl w-fit'
                >
                    {type === 'settings' ? 'View Fields' : 'View Settings'}
                    <ArrowRight className='inline-block h-full' />
                </Link>
            </div>
            <div className='pt-20 pb-4 flex flex-col h-full'>
                <div className='flex justify-between mb-4'>
                    {type === 'settings' ?
                        <EditFormPage
                            form={data as GetFormProps}
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