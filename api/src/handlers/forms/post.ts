import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '../../db.ts'
import { loadSQL } from '../../utils/sql.ts'

export default async function createForm(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    const user_id = req.user!.id
    const title = body.title

    if (!user_id || !title || !body.published_at || !body.expires_at) {
        return res.status(400).send({ error: 'user_id, title, published_at, and expires_at are required' })
    }

    const publishedAt = new Date(body.published_at)
    const expiresAt = new Date(body.expires_at)
    if (isNaN(publishedAt.getTime()) || isNaN(expiresAt.getTime())) {
        return res.status(400).send({ error: 'published_at and expires_at must be valid dates' })
    }
    else if (publishedAt >= expiresAt) {
        return res.status(400).send({ error: 'expires_at must be later than published_at' })
    }
    else if (expiresAt.getTime() - new Date().getTime() > 365 * 24 * 60 * 60 * 1000) {
        return res.status(400).send({ error: 'expire date cannot be more than one year in the future' })
    }

    const sqlParams = [
        user_id,
        title,
        body.description || null,
        body.anonymous_submissions || false,
        body.limit || null,
        publishedAt,
        expiresAt
    ]

    try {
        const sql = await loadSQL('forms/post.sql')
        const result = await run(sql, sqlParams)
        res.status(201).send(result.rows[0])
    } catch (error) {
        console.error('Error creating entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}