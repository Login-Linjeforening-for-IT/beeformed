import type { FastifyReply, FastifyRequest } from 'fastify'
import { deleteEntity } from '../../utils/crud.ts'

export default async function deleteUser(req: FastifyRequest, res: FastifyReply) {
    await deleteEntity({
        req,
        res,
        sqlPath: 'users/delete.sql',
        sqlParams: [req.user!.id]
    })
}