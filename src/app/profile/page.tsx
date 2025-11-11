import { PageContainer } from '@components/container/page'
import { getUser, deleteUser, getForms, getSharedForms } from '@utils/api'
import Button from '@components/button/button'
import { FormPopup } from '@components/form/popup'
import Table from '@components/table/table'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function Page() {
    const user = await getUser()
    const forms = await getForms()
    const sharedForms = await getSharedForms()

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
                        onAction={deleteUser}
                        errorMessage='Failed to delete user'
                        successMessage='User deleted successfully'
                        successRedirectUrl='/api/logout'
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
            {forms && forms.length > 0 &&
            <div className='pt-20'>
                <div className='flex justify-between'>
                    <h1 className='text-2xl font-semibold flex items-center gap-2'>
                        My Forms
                        <FormPopup />
                    </h1>
                    <Link className='text-lg font-semibold flex items-center gap-2' href='/profile/forms'>
                        See all
                        <ArrowRight size={20} />
                    </Link>
                </div>
                <Table
                    data={forms}
                    columns={[
                        { key: 'id', label: 'Form ID' },
                        { key: 'title', label: 'Title' },
                        { key: 'created_at', label: 'Created At' }
                    ]}
                />
            </div>
            }
            {sharedForms && sharedForms.length > 0 &&
            <div className='pt-20'>
                <div className='flex justify-between'>
                    <h1 className='text-2xl font-semibold'>
                        Shared Forms
                    </h1>
                    <Link className='text-lg font-semibold flex items-center gap-2' href='/profile/forms/shared'>
                        See all
                        <ArrowRight size={20} />
                    </Link>
                </div>
                <Table
                    data={sharedForms}
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
