'use client'

import { PageContainer } from '@components/container/page'
import FormPage from '@components/form/pages/form'

export default function CreateFormPage() {
    return (
        <PageContainer title='Create New Form'>
            <div className='w-full max-w-2xl'>
                <FormPage />
            </div>
        </PageContainer>
    )
}
