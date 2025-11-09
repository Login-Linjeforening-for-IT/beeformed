import type { FastifyReply, FastifyRequest } from 'fastify'
import { createEntity } from '../../utils/crud.ts'

export default async function createFormPermission(req: FastifyRequest, res: FastifyReply) {
    await createEntity(
        req,
        res,
        'form-permissions/post.sql',
        ['granted_by'],
        (params, body) => [
            params.id,
            body.user_id || null,
            body.group || null,
            body.granted_by
        ]
    )
}
