import { PageContainer } from '@components/container/page'
import EditFormPage from '@components/form/edit'
import { getForm } from '@utils/api'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string, slug?: string[] | string }> }) {
    const { id, slug } = await params
    const type = Array.isArray(slug) ? slug[0] : slug || 'fields'

    const data = type === 'settings' ? await getForm(id) : {error: 'Not found'}

    if ('error' in data) {
        notFound()
    }

    return (
        <PageContainer title='Editing Form'>
            <div className='pt-20 pb-4 flex flex-col h-full'>
                <div className='flex justify-between mb-4'>
                    {type === 'settings' ?
                        <EditFormPage
                            form={data}
                        />
                        :
                        null
                    }
                </div>
            </div>
        </PageContainer>
    )
}