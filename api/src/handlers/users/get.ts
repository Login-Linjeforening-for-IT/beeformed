import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getUser(req: FastifyRequest, res: FastifyReply) {
    await readEntity({
        req,
        res,
        sqlPath: 'users/get.sql',
        sqlParams: [req.user!.id]
    })
}
