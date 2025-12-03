import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '../../db.ts'
import { loadSQL } from '../../utils/sql.ts'

export default async function getFormPermissions(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any
    const { id } = params

    if (!id) {
        return res.status(400).send({ error: 'id is required' })
    }

    try {
        const sql = await loadSQL('form-permissions/get.sql')
        const result = await run(sql, [id])
        res.send({ data: result.rows, total: result.rows.length })
    } catch (error) {
        console.error('Error reading entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}
