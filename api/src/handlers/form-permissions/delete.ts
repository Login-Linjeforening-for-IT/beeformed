import type { FastifyReply, FastifyRequest } from 'fastify'
import { deleteEntity } from '../../utils/crud.ts'

export default async function deleteFormPermission(req: FastifyRequest, res: FastifyReply) {
    await deleteEntity(
        req,
        res,
        'form-permissions/delete.sql',
        'permissionId'
    )
}