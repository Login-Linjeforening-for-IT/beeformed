import type { FastifyReply } from 'fastify'
import run from '../db.ts'
import { loadSQL } from './sql.ts'

export async function createEntity({
    res,
    sqlPath,
    requiredFields,
    sqlParams
}: {
    res: FastifyReply
    sqlPath: string
    requiredFields?: string[]
    sqlParams: Record<string, SQLParamType> | SQLParamType[]
}) {
    try {
        for (const field of requiredFields || []) {
            if (!(field in sqlParams)) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        const sql = await loadSQL(sqlPath)
        const params = Array.isArray(sqlParams) ? sqlParams : Object.values(sqlParams)
        const result = await run(sql, params)

        res.status(201).send(result.rows[0])
    } catch (error) {
        console.error('Error creating entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}

export async function readEntity({
    res,
    sqlPath,
    sql,
    requiredFields,
    sqlParams,
    singleResult,
    metadata
}: {
    res: FastifyReply
    sqlPath?: string
    sql?: string
    requiredFields?: string[]
    sqlParams: Record<string, SQLParamType> | SQLParamType[]
    singleResult?: boolean
    metadata?: Record<string, unknown> | ((data: unknown[]) => Record<string, unknown>)
}) {
    try {
        for (const field of requiredFields || []) {
            if (!(field in sqlParams)) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        let query: string
        if (sql) {
            query = sql
        } else if (sqlPath) {
            query = await loadSQL(sqlPath)
        } else {
            return res.status(500).send({ error: 'sql or sqlPath must be provided' })
        }

        const params = Array.isArray(sqlParams) ? sqlParams : Object.values(sqlParams)
        const result = await run(query, params)

        const entity = singleResult ? (result.rows.length > 0 ? result.rows[0] : null) : result.rows

        let metadataObj: Record<string, unknown> = {}
        if (typeof metadata === 'function') {
            metadataObj = metadata(entity as unknown[])
        } else if (metadata) {
            metadataObj = metadata
        }

        if (Object.keys(metadataObj).length > 0) {
            res.send({ data: entity, ...metadataObj })
        } else {
            res.send(entity)
        }
    } catch (error) {
        console.error('Error reading entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}

export async function updateEntity({
    res,
    sqlPath,
    requiredFields,
    sqlParams
}: {
    res: FastifyReply
    sqlPath: string
    requiredFields?: string[]
    sqlParams: Record<string, SQLParamType> | SQLParamType[]
}) {
    try {
        for (const field of requiredFields || []) {
            if (!(field in sqlParams)) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        const sql = await loadSQL(sqlPath)
        const params = Array.isArray(sqlParams) ? sqlParams : Object.values(sqlParams)
        const result = await run(sql, params)

        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'Entity not found' })
        }

        res.send(result.rows[0])
    } catch (error) {
        console.error('Error updating entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}

export async function deleteEntity({
    res,
    sqlPath,
    requiredFields,
    sqlParams
}: {
    res: FastifyReply
    sqlPath: string
    requiredFields?: string[]
    sqlParams: Record<string, SQLParamType> | SQLParamType[]
}) {
    try {
        for (const field of requiredFields || []) {
            if (!(field in sqlParams)) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        const sql = await loadSQL(sqlPath)
        const params = Array.isArray(sqlParams) ? sqlParams : Object.values(sqlParams)
        await run(sql, params)

        res.status(204).send()
    } catch (error) {
        console.error('Error deleting entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}