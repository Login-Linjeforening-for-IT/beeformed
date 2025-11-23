import { PageContainer } from '@components/container/page'
import { getUser, deleteUser } from '@utils/api'
import Button from '@components/button/button'
import { FilePlusIcon, Files, FileText } from 'lucide-react'
import Link from 'next/link'
import { FormPopup } from '@components/form/popup'

export default async function Page() {

    const user = await getUser()

    return (
        <PageContainer title='Profile'>
            <div className='flex flex-row gap-6'>
                <FormPopup buttonClassName={`size-50 bg-login-500 shadow-lg rounded-lg p-8
                        flex flex-col items-center justify-center hover:bg-login-600
                        transition-colors cursor-pointer`}
                >
                    <FilePlusIcon size={56} className='text-white' />
                    <p className='text-login-50 text-sm mt-2'>Create Form</p>
                </FormPopup>
                <Link
                    href='/forms'
                    className={`size-50 bg-login-500 shadow-lg rounded-lg p-8
                        flex flex-col items-center justify-center hover:bg-login-600
                        transition-colors`}
                >
                    <Files size={56} className='text-white' />
                    <p className='text-login-50 text-sm mt-2'>My Forms</p>
                </Link>
                <Link
                    href='/submissions'
                    className={`size-50 bg-login-500 shadow-lg rounded-lg p-8
                        flex flex-col items-center justify-center hover:bg-login-600
                        transition-colors`}
                >
                    <FileText size={56} className='text-white' />
                    <p className='text-login-50 text-sm mt-2'>Submissions</p>
                </Link>
            </div>
            {user && !user.error ? (
                <>
                    <div className='highlighted-section mt-20'>
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
        </PageContainer>
    )
}
