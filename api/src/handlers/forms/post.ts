import type { FastifyReply, FastifyRequest } from 'fastify'
import { createEntity } from '../../utils/crud.ts'

export default async function createForm(req: FastifyRequest, res: FastifyReply) {
    return createEntity(req, res, 'forms/post.sql', ['user_id', 'title'], (params, body) => [
        body.user_id,
        body.title,
        body.description || null,
        body.is_active !== undefined ? body.is_active : true,
        body.anonymous_submissions || false,
        body.limit || null,
        body.published_at || new Date(),
        body.expires_at || null
    ])
}