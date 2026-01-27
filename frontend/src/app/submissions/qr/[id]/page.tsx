import QRCodeGenerator from '@components/qr/generator'
import { PageContainer } from '@components/container/page'

export default async function Page({ params }: { params: Promise<{ id: string }>}) {
    const { id } = await params

    return (
        <PageContainer title='QR Code'>
            <div className='flex flex-col items-center justify-center min-h-[60vh] gap-8'>
                <div className='text-center space-y-2'>
                    <h2 className='text-xl font-semibold text-login-100'>Scan to Check Submission</h2>
                </div>

                <div className='p-8'>
                    {id && <QRCodeGenerator data={id} size={300} />}
                </div>

                <div className='max-w-xs w-full bg-login-900 p-4 rounded-lg border border-login-700'>
                    <p className='text-xs text-login-200 font-mono text-center break-all'>
                        {id}
                    </p>
                </div>
            </div>
        </PageContainer>
    )
}
