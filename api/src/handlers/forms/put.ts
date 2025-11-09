import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateEntity } from '../../utils/crud.ts'

export default async function updateForm(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as any
    const params = req.params as any
    await updateEntity({
        req,
        res,
        sqlPath: 'forms/put.sql',
        requiredFields: ['user_id', 'title'],
        sqlParams: [
            params.id,
            body.user_id,
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