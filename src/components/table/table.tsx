'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronUp, ChevronDown, MoreHorizontal, Edit, Trash2 } from 'lucide-react'

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
    onDelete?: (row: Record<string, unknown>) => void
}

export default function Table({ data, columns, currentOrderBy, currentSort, onDelete }: TableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)

    const handleSort = (columnKey: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const newOrder = currentOrderBy === columnKey && currentSort === 'asc' ? 'desc' : 'asc'
        params.set('column', columnKey)
        params.set('order', newOrder)
        params.set('page', '1')
        router.push(`?${params.toString()}`)
    }

    const toggleMenu = (index: number) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index)
    }

    const handleEdit = (row: Record<string, unknown>) => {
        router.push(`/forms/edit/${row.id}`)
        setOpenMenuIndex(null)
    }

    const handleDelete = (row: Record<string, unknown>) => {
        if (onDelete) onDelete(row)
        setOpenMenuIndex(null)
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
                        <th>Actions</th>
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
                            <td className='relative'>
                                <button
                                    onClick={() => toggleMenu(index)}
                                    className='p-1 rounded hover:bg-login-500 cursor-pointer'
                                >
                                    <MoreHorizontal className='w-4 h-4' />
                                </button>
                                {openMenuIndex === index && (
                                    <div className='absolute right-0 mt-1 w-32 bg-login-500
                                        border border-login-600 rounded-lg shadow-lg z-10'>
                                        <button
                                            onClick={() => handleEdit(row)}
                                            className='flex items-center w-full px-3 py-2 text-sm hover:bg-login-600 cursor-pointer'
                                        >
                                            <Edit className='w-4 h-4 mr-2' />
                                            Edit
                                        </button>
                                        {onDelete && (
                                            <button
                                                onClick={() => handleDelete(row)}
                                                className='flex items-center w-full px-3 py-2 text-sm
                                                    hover:bg-login-600 text-red-400 cursor-pointer'
                                            >
                                                <Trash2 className='w-4 h-4 mr-2' />
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}