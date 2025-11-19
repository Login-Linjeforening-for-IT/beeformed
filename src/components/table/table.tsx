'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronUp, ChevronDown } from 'lucide-react'

type Column = {
    key: string
    label: string
    sortable?: boolean
}

type TableProps = {
    data: Record<string, unknown>[]
    columns: Column[]
    currentOrderBy?: string
    currentSort?: 'asc' | 'desc'
}

export default function Table({ data, columns, currentOrderBy, currentSort }: TableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSort = (columnKey: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const newOrder = currentOrderBy === columnKey && currentSort === 'asc' ? 'desc' : 'asc'
        params.set('column', columnKey)
        params.set('order', newOrder)
        params.set('page', '1')
        router.push(`?${params.toString()}`)
    }

    return (
        <div className='prose prose-login max-w-none py-4'>
            <table className='w-full'>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`group ${column.sortable ? 'cursor-pointer' : ''}`}
                                onClick={column.sortable ? () => handleSort(column.key) : undefined}
                            >
                                <div className='flex items-center justify-between'>
                                    <span>{column.label}</span>
                                    {column.sortable && (
                                        <span className={`transition-opacity ${
                                            currentOrderBy === column.key
                                                ? 'opacity-100'
                                                : 'opacity-40 group-hover:opacity-100'
                                        }`}>
                                            {currentOrderBy === column.key ? (
                                                currentSort === 'asc'
                                                    ? <ChevronUp className='w-4 h-4' />
                                                    : <ChevronDown className='w-4 h-4' />
                                            ) : (
                                                <ChevronDown className='w-4 h-4' />
                                            )}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {String(row[column.key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}