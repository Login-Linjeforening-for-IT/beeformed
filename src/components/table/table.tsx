import React from 'react'

type Column = {
    key: string
    label: string
}

type TableProps = {
    data: Record<string, unknown>[]
    columns: Column[]
}

export default function Table({ data, columns }: TableProps) {
    return (
        <div className='prose prose-login max-w-none py-4'>
            <table className='w-full'>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.label}
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