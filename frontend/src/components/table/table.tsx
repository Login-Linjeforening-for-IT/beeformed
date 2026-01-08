'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronUp, ChevronDown, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'

type Column = {
    key: string
    label: string
    sortable?: boolean
    highlightColor?: 'red' | 'green' | 'orange' | ((row: Record<string, unknown>) => 'red' | 'green' | 'orange' | undefined)
}

type TableProps = {
    data: Record<string, unknown>[]
    columns: Column[]
    currentOrderBy?: string
    currentSort?: 'asc' | 'desc'
    onDelete?: (row: Record<string, unknown>) => void
    canDelete?: (row: Record<string, unknown>) => boolean
    disableEdit?: boolean
    viewBaseHref?: string
    viewHrefKey?: string
}

export default function Table({
    data,
    columns,
    currentOrderBy,
    currentSort,
    onDelete,
    canDelete,
    disableEdit,
    viewBaseHref,
    viewHrefKey = 'id'
}: TableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)

    function handleSort(columnKey: string) {
        const params = new URLSearchParams(searchParams.toString())
        const newOrder = currentOrderBy === columnKey && currentSort === 'asc' ? 'desc' : 'asc'
        params.set('column', columnKey)
        params.set('order', newOrder)
        params.set('page', '1')
        router.push(`?${params.toString()}`)
    }

    function toggleMenu(index: number) {
        setOpenMenuIndex(openMenuIndex === index ? null : index)
    }

    function handleEdit(row: Record<string, unknown>) {
        router.push(`/form/${row.id}`)
        setOpenMenuIndex(null)
    }

    function handleDelete(row: Record<string, unknown>) {
        if (onDelete) onDelete(row)
        setOpenMenuIndex(null)
    }

    function handleView(row: Record<string, unknown>) {
        if (viewBaseHref) router.push(`${viewBaseHref}${row[viewHrefKey]}`)
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
                            {columns.map((column) => {
                                const color = typeof column.highlightColor === 'function'
                                    ? column.highlightColor(row)
                                    : column.highlightColor
                                return (
                                    <td key={column.key} className={color ? `text-${color}-500` : ''}>
                                        {String(row[column.key])}
                                    </td>
                                )
                            })}
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
                                        {!disableEdit && (
                                            <button
                                                onClick={() => handleEdit(row)}
                                                className='flex items-center w-full px-3 py-2 text-sm hover:bg-login-600 cursor-pointer'
                                            >
                                                <Edit className='w-4 h-4 mr-2' />
                                                Edit
                                            </button>
                                        )}
                                        {viewBaseHref && (
                                            <button
                                                onClick={() => handleView(row)}
                                                className='flex items-center w-full px-3 py-2 text-sm hover:bg-login-600 cursor-pointer'
                                            >
                                                <Eye className='w-4 h-4 mr-2' />
                                                View
                                            </button>
                                        )}
                                        {onDelete && (!canDelete || canDelete(row)) && (
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