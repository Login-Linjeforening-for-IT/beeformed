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
    sqlParams: Record<string, SQLParamType>
}) {
    try {
        for (const field of requiredFields || []) {
            if (!(field in sqlParams)) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        const sql = await loadSQL(sqlPath)
        const result = await run(sql, Object.values(sqlParams))

        res.status(201).send(result.rows[0])
    } catch (error) {
        console.error('Error creating entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}

export async function readEntity({
    res,
    sqlPath,
    requiredFields,
    sqlParams
}: {
    res: FastifyReply
    sqlPath: string
    requiredFields?: string[]
    sqlParams: Record<string, SQLParamType>
}) {
    try {
        for (const field of requiredFields || []) {
            if (!(field in sqlParams)) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        const sql = await loadSQL(sqlPath)
        const result = await run(sql, Object.values(sqlParams))

        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'Entity not found' })
        }

        const entity = result.rows[0]

        res.send(entity)
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
    sqlParams: Record<string, SQLParamType>
}) {
    try {
        for (const field of requiredFields || []) {
            if (!(field in sqlParams)) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        const sql = await loadSQL(sqlPath)
        const result = await run(sql, Object.values(sqlParams))

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
    sqlParams: Record<string, SQLParamType>
}) {
    try {
        for (const field of requiredFields || []) {
            if (!(field in sqlParams)) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        const sql = await loadSQL(sqlPath)
        await run(sql, Object.values(sqlParams))

        res.status(204).send()
    } catch (error) {
        console.error('Error deleting entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}