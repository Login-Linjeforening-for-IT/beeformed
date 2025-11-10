import type { FastifyReply, FastifyRequest } from 'fastify'
import { createEntity } from '../../utils/crud.ts'

export default async function createFormPermission(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any
    await createEntity({
        req,
        res,
        sqlPath: 'form-permissions/post.sql',
        requiredFields: ['form_id', 'granted_by'],
        sqlParams: {
            form_id: params.id,
            user_id: body.user_id || null,
            group: body.group || null,
            granted_by: req.user!.id
        }
    })
}
