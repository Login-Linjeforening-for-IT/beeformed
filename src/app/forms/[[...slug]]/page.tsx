import { PageContainer } from '@components/container/page'
import { getForms, getSharedForms } from '@utils/api'
import Table from '@components/table/table'
import Pagination from '@components/pagination/pagination'
import SearchInput from '@components/search/search'
import { FormPopup } from '@components/form/popup'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type PageProps = {
    params: Promise<{ slug?: string[] | string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
    const param = await params
    const filters = await searchParams

    const slugs = param.slug
    const type = slugs && (Array.isArray(slugs) ? slugs[0] : slugs)

    const search = typeof filters.q === 'string' ? filters.q : ''
    const page = typeof filters.page === 'string' ? Number(filters.page) : 1
    const limit = 14
    const offset = (page - 1) * limit
    const orderBy = typeof filters.column === 'string' ? filters.column : 'created_at'
    const sort: 'asc' | 'desc' = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'

    const filter = {
        search,
        offset,
        limit,
        orderBy,
        sort
    }

    const forms = type === 'shared' ? await getSharedForms(filter) : await getForms(filter)

    const formsData = forms.data || []
    const totalItems = forms.total

    return (
        <PageContainer title={type === 'shared' ? 'Shared Forms' : 'My Forms'}>
            <div>
                <Link href={type === 'shared' ? '/forms' : '/forms/shared'} className='flex items-center gap-1 hover:gap-2 text-xl w-fit'>
                    {type === 'shared' ? 'View My Forms' : 'View Shared Forms'}
                    <ArrowRight className='inline-block h-full' />
                </Link>
            </div>
            {formsData && formsData.length > 0 &&
                <div className='pt-20 pb-4 flex flex-col h-full'>
                    <div className='flex justify-between mb-4'>
                        <SearchInput placeholder='Search forms...' />
                        <FormPopup />
                    </div>

                    <div className='flex-1 flex flex-col justify-between min-h-0'>
                        <Table
                            data={formsData}
                            columns={[
                                { key: 'id', label: 'Form ID', sortable: true },
                                { key: 'title', label: 'Title', sortable: true },
                                { key: 'created_at', label: 'Created At', sortable: true }
                            ]}
                            currentOrderBy={orderBy}
                            currentSort={sort}
                        />

                        <Pagination
                            pageSize={limit}
                            totalRows={totalItems}
                        />
                    </div>
                </div>
            }
        </PageContainer>
    )
}
