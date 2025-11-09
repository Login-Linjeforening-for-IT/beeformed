export function PageContainer({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className='w-full page-container'>
            <div className='flex flex-col col-start-3'>
                <h1 className='heading'>{title}</h1>
                {children}
            </div>
        </div>
    )
}
