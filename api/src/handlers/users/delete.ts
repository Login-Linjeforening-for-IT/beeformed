import type { FastifyReply, FastifyRequest } from 'fastify'
import { deleteEntity } from '../../utils/crud.ts'

export default async function deleteUser(req: FastifyRequest, res: FastifyReply) {
    await deleteEntity({
        res,
        sqlPath: 'users/delete.sql',
        requiredFields: ['id'],
        sqlParams: {
            id: req.user!.id
        }
    })
}