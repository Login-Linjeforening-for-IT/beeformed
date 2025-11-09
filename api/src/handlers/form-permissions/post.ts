import type { FastifyReply, FastifyRequest } from 'fastify'
import { createEntity } from '../../utils/crud.ts'

export default async function createFormPermission(req: FastifyRequest, res: FastifyReply) {
    await createEntity(
        req,
        res,
        'form-permissions/post.sql',
        ['form_id', 'permission_type', 'granted_by'],
        (body) => [
            body.form_id,
            body.user_id,
            body.group || null,
            body.granted_by
        ]
    )
}
