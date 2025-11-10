import type { FastifyReply, FastifyRequest } from 'fastify'
import { createEntity } from '../../utils/crud.ts'

export default async function createForm(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    return createEntity({
        res,
        sqlPath: 'forms/post.sql',
        requiredFields: ['user_id', 'title'],
        sqlParams: {
            user_id:                req.user!.id,
            title:                  body.title,
            description:            body.description || null,
            is_active:              body.is_active || true,
            anonymous_submissions:  body.anonymous_submissions || false,
            limit:                  body.limit || null,
            published_at:           body.published_at || new Date(),
            expires_at:             body.expires_at || null
        }
    })
}