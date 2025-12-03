import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '../../db.ts'
import { loadSQL } from '../../utils/sql.ts'

export default async function createUser(req: FastifyRequest, res: FastifyReply) {
    const user_id = req.user!.id
    const email = req.user!.email
    const name = req.user!.name

    if (!user_id || !email || !name) {
        return res.status(400).send({ error: 'user_id, email, and name are required' })
    }

    try {
        const sql = await loadSQL('users/post.sql')
        const result = await run(sql, [user_id, email, name])
        res.status(201).send(result.rows[0])
    } catch (error) {
        console.error('Error creating entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}
