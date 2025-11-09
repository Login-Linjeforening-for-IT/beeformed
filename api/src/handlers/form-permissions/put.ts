import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateEntity } from '../../utils/crud.ts'

export default async function updateFormPermission(req: FastifyRequest, res: FastifyReply) {
    return updateEntity(
        req,
        res,
        'form-permissions/put.sql',
        ['granted_by'],
        (id: any, body: any) => [
            id,
            body.user_id || null,
            body.group || null,
            body.granted_by 
        ],
        'permissionId'
    )
}