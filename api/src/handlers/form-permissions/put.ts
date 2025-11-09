import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateEntity } from '../../utils/crud.ts'

export default async function updateFormPermission(req: FastifyRequest, res: FastifyReply) {
    return updateEntity(
        req,
        res,
        'form_permissions',
        ['granted_by'],
        (body: any, id: any) => [
            id,
            body.user_id,
            body.group,
            body.granted_by 
        ]
    )
}