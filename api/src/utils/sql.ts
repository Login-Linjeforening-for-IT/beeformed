import { readFile } from 'fs/promises'
import { join } from 'path'

export async function loadSQL(file: string) {
    const filePath = join(process.cwd(), 'src/queries/', file)
    return readFile(filePath, 'utf-8')
}

export async function buildFilteredQuery(
    sqlPath: string,
    initialParams: SQLParamType[],
    query: {
        search?: string
        limit?: string
        offset?: string
        order_by?: string
        sort?: string
    },
    tablePrefix?: string
) {
    const baseSQL = await loadSQL(sqlPath)
    const search = query.search
    const limit = query.limit ? parseInt(query.limit) : undefined
    const offset = query.offset ? parseInt(query.offset) : undefined
    const orderBy = query.order_by || 'created_at'
    const sort = query.sort === 'asc' ? 'ASC' : 'DESC'

    const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/
    if (!identifierRegex.test(orderBy)) {
        throw new Error('Invalid order_by parameter')
    }

    let sql = baseSQL.trim()
    const params = [...initialParams]

    if (search) {
        const titleField = tablePrefix ? `${tablePrefix}.title` : 'title'
        const descField = tablePrefix ? `${tablePrefix}.description` : 'description'
        sql += ` AND (${titleField} ILIKE $${params.length + 1} OR ${descField} ILIKE $${params.length + 1})`
        params.push(`%${search}%`)
    }

    const orderField = tablePrefix ? `${tablePrefix}.${orderBy}` : orderBy
    sql += ` ORDER BY ${orderField} ${sort}`

    if (limit) {
        sql += ` LIMIT $${params.length + 1}`
        params.push(limit)
    }

    if (offset) {
        sql += ` OFFSET $${params.length + 1}`
        params.push(offset)
    }

    return { sql, params }
}
