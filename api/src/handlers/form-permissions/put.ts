import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateEntity } from '../../utils/crud.ts'

export default async function updateFormPermission(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any
    return updateEntity({
        res,
        sqlPath: 'form-permissions/put.sql',
        requiredFields: ['id', 'granted_by'],
        sqlParams: {
            id:         params.id,
            user_id:    body.user_id || null,
            group:      body.group  || null,
            granted_by: req.user!.id,
        }
    })
}