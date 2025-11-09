import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateEntity } from '../../utils/crud.ts'

export default async function updateFormPermission(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any
    return updateEntity({
        req,
        res,
        sqlPath: 'form-permissions/put.sql',
        requiredFields: ['granted_by'],
        sqlParams: [
            params.id,
            body.user_id || null,
            body.group || null,
            req.user!.id,
        ]
    })
}