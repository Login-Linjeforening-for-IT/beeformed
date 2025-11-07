import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '../db'
import { loadSQL } from './sql'

export async function createEntity(
    req: FastifyRequest,
    res: FastifyReply,
    sqlPath: string,
    requiredFields: string[],
    paramMapper: (body: any) => SQLParamType[]
) {
    try {
        const body = req.body as any

        for (const field of requiredFields) {
            if (!body[field]) {
                return res.status(400).send({ error: `${field} is required` })
            }
        }

        const sql = await loadSQL(sqlPath)
        const params = paramMapper(body)
        const result = await run(sql, params)

        res.status(201).send(result.rows[0])
    } catch (error) {
        console.error('Error creating entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}

export async function deleteEntity(
    req: FastifyRequest,
    res: FastifyReply,
    sqlPath: string,
    idParam: string = 'id'
) {
    try {
        const id = (req.params as any)[idParam]

        if (!id) {
            return res.status(400).send({ error: 'ID is required' })
        }

        const sql = await loadSQL(sqlPath)
        await run(sql, [id])

        res.status(204).send()
    } catch (error) {
        console.error('Error deleting entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}