import type { FastifyReply, FastifyRequest } from 'fastify'
import { deleteEntity } from '../../utils/crud.ts'

export default async function deleteForm(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any
    await deleteEntity({
        req,
        res,
        sqlPath: 'forms/delete.sql',
        sqlParams: [params.id]
    })
}