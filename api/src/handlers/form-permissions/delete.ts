import type { FastifyReply, FastifyRequest } from 'fastify'
import { deleteEntity } from '../../utils/crud.ts'

export default async function deleteFormPermission(req: FastifyRequest, res: FastifyReply) {
    const params = req.params as any
    await deleteEntity({
        req,
        res,
        sqlPath: 'form-permissions/delete.sql',
        sqlParams: [params.id]
    })
}