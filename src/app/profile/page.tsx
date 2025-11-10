import { PageContainer } from '@components/container/page'
import { getUser, deleteUser, getForms } from '@utils/api'
import Button from '@components/button/button'
import { FormPopup } from '@components/form/popup'
import Table from '@components/table/table'

export default async function Page() {
    const user = await getUser()
    const forms = await getForms()

    console.log('Forms:', forms)

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
            <div className='pt-20'>
                <h1 className='text-2xl font-semibold'>
                    My Forms
                </h1>
                <Table
                    data={forms}
                    columns={[
                        { key: 'id', label: 'Form ID' },
                        { key: 'title', label: 'Title' },
                        { key: 'created_at', label: 'Created At' }
                    ]}
                />
                <FormPopup />
            </div>
        </PageContainer>
    )
}
