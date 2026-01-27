'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronUp, ChevronDown, MoreHorizontal, Edit, Trash2, Eye, Settings, Shield, List, Share } from 'lucide-react'
import { toast } from 'uibee/components'

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
    showFormActions?: boolean
    customActions?: (row: Record<string, unknown>, closeMenu: () => void) => React.ReactNode
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
    viewHrefKey = 'id',
    showFormActions = false,
    customActions
}: TableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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

    function handleSettings(row: Record<string, unknown>) {
        router.push(`/form/${row.id}/settings`)
        setOpenMenuIndex(null)
    }

    function handlePermissions(row: Record<string, unknown>) {
        router.push(`/form/${row.id}/permissions`)
        setOpenMenuIndex(null)
    }

    function handleSubmissions(row: Record<string, unknown>) {
        router.push(`/form/${row.id}/submissions`)
        setOpenMenuIndex(null)
    }

    function handleQR(row: Record<string, unknown>) {
        router.push(`/qr/${row.id}`)
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

    function handleShare(row: Record<string, unknown>) {
        const slug = row.slug as string
        const link = `${window.location.origin}/f/${slug}`
        navigator.clipboard.writeText(link)
        setOpenMenuIndex(null)
        toast.success('Form link copied to clipboard!')
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (hoveredIndex === null) return
            const row = data[hoveredIndex]
            if (!row) return

            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

            switch (e.key.toLowerCase()) {
                case 'e':
                    if (!disableEdit) handleEdit(row)
                    break
                case 's':
                    if (showFormActions) handleSettings(row)
                    break
                case 'p':
                    if (showFormActions) handlePermissions(row)
                    break
                case 'a':
                    if (showFormActions) handleSubmissions(row)
                    break
                case 'v':
                    if (viewBaseHref) handleView(row)
                    break
                case 'q':
                    if (showFormActions) handleQR(row)
                    break
                case 'h':
                    handleShare(row)
                    break
                case 'd':
                    if (onDelete && (!canDelete || canDelete(row))) handleDelete(row)
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [hoveredIndex, data, disableEdit, showFormActions, viewBaseHref, onDelete, canDelete])

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
                        <tr
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
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
                                    <div className='absolute right-0 mt-1 w-44 bg-login-500
                                        border border-login-600 rounded-lg shadow-lg z-10 overflow-hidden'>
                                        {!disableEdit && (
                                            <button
                                                onClick={() => handleEdit(row)}
                                                className={`flex items-center justify-between w-full px-3 py-2 text-sm
                                                    hover:bg-login-600 cursor-pointer`}
                                            >
                                                <div className='flex items-center'>
                                                    <Edit className='w-4 h-4 mr-2' />
                                                    Edit
                                                </div>
                                                <span className='text-xs opacity-50 font-mono'>E</span>
                                            </button>
                                        )}
                                        {showFormActions && (
                                            <>
                                                <button
                                                    onClick={() => handleSettings(row)}
                                                    className={`flex items-center justify-between w-full px-3 py-2 text-sm
                                                        hover:bg-login-600 cursor-pointer`}
                                                >
                                                    <div className='flex items-center'>
                                                        <Settings className='w-4 h-4 mr-2' />
                                                        Settings
                                                    </div>
                                                    <span className='text-xs opacity-50 font-mono'>S</span>
                                                </button>
                                                <button
                                                    onClick={() => handlePermissions(row)}
                                                    className={`flex items-center justify-between w-full px-3 py-2 text-sm
                                                        hover:bg-login-600 cursor-pointer`}
                                                >
                                                    <div className='flex items-center'>
                                                        <Shield className='w-4 h-4 mr-2' />
                                                        Permissions
                                                    </div>
                                                    <span className='text-xs opacity-50 font-mono'>P</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSubmissions(row)}
                                                    className={`flex items-center justify-between w-full px-3 py-2 text-sm
                                                        hover:bg-login-600 cursor-pointer`}
                                                >
                                                    <div className='flex items-center'>
                                                        <List className='w-4 h-4 mr-2' />
                                                        Submissions
                                                    </div>
                                                    <span className='text-xs opacity-50 font-mono'>A</span>
                                                </button>
                                                <button
                                                    onClick={() => handleQR(row)}
                                                    className={`flex items-center justify-between w-full px-3 py-2 text-sm
                                                        hover:bg-login-600 cursor-pointer`}
                                                >
                                                    <div className='flex items-center'>
                                                        <List className='w-4 h-4 mr-2' />
                                                        QR
                                                    </div>
                                                    <span className='text-xs opacity-50 font-mono'>Q</span>
                                                </button>
                                                <button
                                                    onClick={() => handleShare(row)}
                                                    className={`flex items-center justify-between w-full px-3 py-2 text-sm
                                                        hover:bg-login-600 cursor-pointer`}
                                                >
                                                    <div className='flex items-center'>
                                                        <Share className='w-4 h-4 mr-2' />
                                                        Share
                                                    </div>
                                                    <span className='text-xs opacity-50 font-mono'>H</span>
                                                </button>
                                            </>
                                        )}
                                        {customActions && customActions(row, () => setOpenMenuIndex(null))}
                                        {viewBaseHref && (
                                            <button
                                                onClick={() => handleView(row)}
                                                className={`flex items-center justify-between w-full px-3 py-2 text-sm
                                                    hover:bg-login-600 cursor-pointer`}
                                            >
                                                <div className='flex items-center'>
                                                    <Eye className='w-4 h-4 mr-2' />
                                                    View
                                                </div>
                                                <span className='text-xs opacity-50 font-mono'>V</span>
                                            </button>
                                        )}
                                        {onDelete && (!canDelete || canDelete(row)) && (
                                            <button
                                                onClick={() => handleDelete(row)}
                                                className={`flex items-center justify-between w-full px-3 py-2 text-sm
                                                    hover:bg-login-600 text-red-400 cursor-pointer`}
                                            >
                                                <div className='flex items-center'>
                                                    <Trash2 className='w-4 h-4 mr-2' />
                                                    Delete
                                                </div>
                                                <span className='text-xs opacity-50 font-mono'>D</span>
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