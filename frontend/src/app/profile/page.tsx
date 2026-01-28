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
            <div className='grid grid-cols-3 gap-3 md:gap-6 w-full max-w-3xl'>
                <FormPopup buttonClassName={`w-full aspect-square bg-login-500 shadow-lg rounded-lg p-2 md:p-8
                        flex flex-col items-center justify-center hover:bg-login-600
                        transition-colors cursor-pointer`}
                >
                    <FilePlusIcon className='text-white w-8 h-8 md:w-14 md:h-14' />
                    <p className='text-login-50 text-xs md:text-sm mt-2 text-center'>Create Form</p>
                </FormPopup>
                <Link
                    href='/forms'
                    className={`w-full aspect-square bg-login-500 shadow-lg rounded-lg p-2 md:p-8
                        flex flex-col items-center justify-center hover:bg-login-600
                        transition-colors`}
                >
                    <Files className='text-white w-8 h-8 md:w-14 md:h-14' />
                    <p className='text-login-50 text-xs md:text-sm mt-2 text-center'>My Forms</p>
                </Link>
                <Link
                    href='/submissions'
                    className={`w-full aspect-square bg-login-500 shadow-lg rounded-lg p-2 md:p-8
                        flex flex-col items-center justify-center hover:bg-login-600
                        transition-colors`}
                >
                    <FileText className='text-white w-8 h-8 md:w-14 md:h-14' />
                    <p className='text-login-50 text-xs md:text-sm mt-2 text-center'>Submissions</p>
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
