import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getSubmissionsByUser(req: FastifyRequest, res: FastifyReply) {
    const userId = req.user!.id

    return readEntity({
        res,
        sqlPath: 'submissions/getAllByUser.sql',
        sqlParams: [userId]
    })
}