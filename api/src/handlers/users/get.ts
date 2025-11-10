import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getUser(req: FastifyRequest, res: FastifyReply) {
    await readEntity({
        res,
        sqlPath: 'users/get.sql',
        requiredFields: ['id'],
        sqlParams: {
            id: req.user!.id
        },
        singleResult: true
    })
}
