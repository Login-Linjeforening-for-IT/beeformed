import type { FastifyReply, FastifyRequest } from 'fastify'
import { createEntity } from '../../utils/crud.ts'

export default async function createForm(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as any
    return createEntity({
        req,
        res,
        sqlPath: 'forms/post.sql',
        requiredFields: ['user_id', 'title'],
        sqlParams: [
            req.user!.id,
            body.title,
            body.description || null,
            body.is_active !== undefined ? body.is_active : true,
            body.anonymous_submissions || false,
            body.limit || null,
            body.published_at || new Date(),
            body.expires_at || null
        ]
    })
}