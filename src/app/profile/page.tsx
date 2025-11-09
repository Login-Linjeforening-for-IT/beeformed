import { PageContainer } from '@components/container/page'
import { getUser, deleteUser } from '@utils/api'
import Button from '@components/button/button'

export default async function Page() {
    const user = await getUser()

    return (
        <PageContainer title='Profile'>
                {user && !user.error && (
                    <div className='highlighted-section'>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p>Created {new Date(user.created_at).toLocaleString('no-NO')}</p>
                        <Button 
                            onAction={deleteUser} 
                            errorMessage='Failed to delete user' 
                            successMessage='User deleted successfully'
                            successRedirectUrl='/api/logout'
                            className='mt-4 px-4 py-2 bg-red-800 rounded '
                        >
                            Delete User
                        </Button>
                    </div>
            )}
            {user.error && (
                <div className='highlighted-section'>
                    <p>No user data available</p>
                </div>
            )}
        </PageContainer>
    )
}
