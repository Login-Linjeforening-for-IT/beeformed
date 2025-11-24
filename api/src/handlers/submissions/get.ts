import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getSubmission(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string }
    const userId = req.user!.id

    return readEntity({
        res,
        sqlPath: 'submissions/get.sql',
        sqlParams: [id, userId],
        singleResult: true
    })
}