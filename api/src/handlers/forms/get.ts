import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '../../db.ts'
import { loadSQL } from '../../utils/sql.ts'

export default async function getForm(req: FastifyRequest, res: FastifyReply) {
    try {
        const id = (req.params as any).id

        if (!id) {
            return res.status(400).send({ error: 'Form ID is required' })
        }

        const sql = await loadSQL('forms/getOne.sql')
        const result = await run(sql, [id])

        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'Form not found' })
        }

        res.send(result.rows[0])
    } catch (error) {
        console.error('Error getting form:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}