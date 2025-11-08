import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateEntity } from '../../utils/crud.ts'

export default async function updateForm(req: FastifyRequest, res: FastifyReply) {
    await updateEntity(
        req,
        res,
        'forms/put.sql',
        ['user_id', 'title'],
        (body: any, id: any) => [
            id,
            body.user_id,
            body.title,
            body.description || null,
            body.is_active !== undefined ? body.is_active : true,
            body.anonymous_submissions || false,
            body.limit || null,
            body.published_at || new Date(),
            body.expires_at || null
        ]
    )
}