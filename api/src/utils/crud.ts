import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '../db.ts'
import { loadSQL } from './sql.ts'

export async function createEntity({
    req,
    res,
    sqlPath,
    requiredFields,
    sqlParams
}: {
    req: FastifyRequest
    res: FastifyReply
    sqlPath: string
    requiredFields: string[]
    sqlParams: SQLParamType[]
}) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = req.body as any

        for (const field of requiredFields) {
            if (!body[field]) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        const sql = await loadSQL(sqlPath)
        const params = sqlParams
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
    sqlParams,
}: {
    req: FastifyRequest
    res: FastifyReply
    sqlPath: string
    sqlParams: SQLParamType[]
}) {
    try {
        const sql = await loadSQL(sqlPath)
        const result = await run(sql, sqlParams)

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
    req,
    res,
    sqlPath,
    requiredFields,
    sqlParams
}: {
    req: FastifyRequest
    res: FastifyReply
    sqlPath: string
    requiredFields: string[]
    sqlParams: SQLParamType[]
}) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = req.body as any

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const key in req.params as any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!(req.params as any)[key]) {
                return res.status(400).send({ error: 'ID is required' })
            }
        }

        for (const field of requiredFields) {
            if (!body[field]) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        const sql = await loadSQL(sqlPath)
        const params = sqlParams
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
    sqlParams
}: {
    req: FastifyRequest
    res: FastifyReply
    sqlPath: string
    sqlParams: SQLParamType[]
}) {
    try {
        const sql = await loadSQL(sqlPath)
        await run(sql, sqlParams)

        res.status(204).send()
    } catch (error) {
        console.error('Error deleting entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}