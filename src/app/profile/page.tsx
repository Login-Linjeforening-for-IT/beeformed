import { PageContainer } from '@components/container/page'
import { getUser, deleteUser, getForms, getSharedForms } from '@utils/api'
import Button from '@components/button/button'
import { FormPopup } from '@components/form/popup'
import Table from '@components/table/table'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function Page() {
    const filter = {
        limit: 5,
        offset: 0,
        sortBy: 'created_at',
        sortOrder: 'desc'
    }

    const user = await getUser()
    const forms = await getForms(filter)
    const formsData = forms.data || []
    const sharedForms = await getSharedForms(filter)
    const sharedFormsData = sharedForms.data || []

    return (
        <PageContainer title='Profile'>
            {user && !user.error ? (
                <>
                    <div className='highlighted-section'>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p>Created {new Date(user.created_at).toLocaleString('no-NO')}</p>
                    </div>
                    <Button
                        href='/api/logout'
                        onAction={deleteUser}
                        errorMessage='Failed to delete user'
                        successMessage='User deleted successfully'
                        className='mb-4 px-4 py-2 bg-red-800 rounded w-fit'
                    >
                        Delete User
                    </Button>
                </>
            ) : (
                <div className='highlighted-section'>
                    <p>No user data available</p>
                </div>
            )}
            {formsData && formsData.length > 0 &&
            <div className='pt-20'>
                <div className='flex justify-between'>
                    <h1 className='text-2xl font-semibold flex items-center gap-2'>
                        My Forms
                        <FormPopup />
                    </h1>
                    <Link className='text-lg font-semibold flex items-center gap-2' href='/forms'>
                        See all
                        <ArrowRight size={20} />
                    </Link>
                </div>
                <Table
                    data={formsData}
                    columns={[
                        { key: 'id', label: 'Form ID' },
                        { key: 'title', label: 'Title' },
                        { key: 'created_at', label: 'Created At' }
                    ]}
                />
            </div>
            }
            {sharedFormsData && sharedFormsData.length > 0 &&
            <div className='pt-20'>
                <div className='flex justify-between'>
                    <h1 className='text-2xl font-semibold'>
                        Shared Forms
                    </h1>
                    <Link className='text-lg font-semibold flex items-center gap-2' href='/forms/shared'>
                        See all
                        <ArrowRight size={20} />
                    </Link>
                </div>
                <Table
                    data={sharedFormsData}
                    columns={[
                        { key: 'id', label: 'Form ID' },
                        { key: 'title', label: 'Title' },
                        { key: 'created_at', label: 'Created At' }
                    ]}
                />
            </div>}
        </PageContainer>
    )
}
