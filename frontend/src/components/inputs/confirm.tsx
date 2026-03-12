'use client'

import { deleteUser } from '@utils/api'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, ConfirmPopup, toast } from 'uibee/components'

export default function Confirm() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    return (
        <>
            <Button
                text='Delete Account'
                icon={<Trash2 className='w-4 h-4' />}
                onClick={() => setIsOpen(true)}
                variant='danger'
            />

            <ConfirmPopup
                isOpen={isOpen}
                header='Delete Form User'
                description={`Are you sure you want to delete this user? This action cannot be undone.
                    NB! This will not delete your SSO account (authentik)`}
                confirmText='Delete'
                cancelText='Cancel'
                onConfirm={
                    async () => {
                        setIsOpen(false)
                        try {
                            const response = await deleteUser()
                            if ('error' in response) {
                                toast.error(response.error as string)
                                return
                            }
                            toast.success('User deleted successfully')
                            router.push('/')
                        } catch (error) {
                            toast.error('An error occurred while deleting the user')
                            console.error(error)
                        }
                    }
                }
                onCancel={
                    () => {
                        setIsOpen(false)
                    }
                }
                variant='danger'
            />
        </>
    )
}
