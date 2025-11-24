import { getPublicForm } from '@utils/api'
import FormRenderer from '@components/form/renderer'
import { PageContainer } from '@components/container/page'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const form = await getPublicForm(slug)

    console.log('Public form data:', form)

    if ('error' in form) {
        notFound()
    }

    return (
        <PageContainer title={form.title}>
            {form.description &&
                <div className='highlighted-section'>
                    <p>{form.description}</p>
                </div>
            }
            <FormRenderer form={{ ...form, id: slug }} />
        </PageContainer>
    )
}