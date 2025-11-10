import type { FastifyReply, FastifyRequest } from 'fastify'
import { deleteEntity } from '../../utils/crud.ts'

export default async function deleteForm(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any
    await deleteEntity({
        res,
        sqlPath: 'forms/delete.sql',
        requiredFields: ['id'],
        sqlParams: {
            id: params.id
        }
    })
}