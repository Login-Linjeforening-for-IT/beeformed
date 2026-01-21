import { getPublicForm } from '@utils/api'
import FormRenderer from '@components/form/renderer'
import { PageContainer } from '@components/container/page'
import { Alert } from 'uibee/components'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const form = await getPublicForm(slug)

    if (!form || 'error' in form) {
        return (
            <PageContainer title='Form Not Found'>
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert variant='warning'>
                        <p>
                            The form you are looking for does not exist or is not published.
                        </p>
                    </Alert>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer title={form.title}>
            {form.description &&
                <div className='highlighted-section'>
                    <p>{form.description}</p>
                </div>
            }
            <FormRenderer form={{ ...form, id: form.id.toString() }} />
        </PageContainer>
    )
}