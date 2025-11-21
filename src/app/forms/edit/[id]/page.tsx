import { PageContainer } from '@components/container/page'
import { getForm } from '@utils/api'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const form = await getForm(id)

    if ('error' in form) {
        notFound()
    }

    return (
        <PageContainer title={`Editing Form: ${form.title}`}>
            <div className='pt-20 pb-4 flex flex-col h-full'>
                <div className='flex justify-between mb-4'>
                    {/* edit logic */}
                </div>
            </div>
        </PageContainer>
    )
}