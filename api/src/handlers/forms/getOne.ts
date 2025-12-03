import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '../../db.ts'
import { loadSQL } from '../../utils/sql.ts'

export default async function getOneForm(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any
    const { id } = params

    if (!id) {
        return res.status(400).send({ error: 'id is required' })
    }

    try {
        const sql = await loadSQL('forms/get.sql')
        const result = await run(sql, [id])
        const entity = result.rows.length > 0 ? result.rows[0] : null
        res.send(entity)
    } catch (error) {
        console.error('Error reading entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}