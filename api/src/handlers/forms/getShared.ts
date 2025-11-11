import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getSharedForms(req: FastifyRequest, res: FastifyReply) {
    await readEntity({
        res,
        sqlPath: 'forms/getShared.sql',
        requiredFields: ['id'],
        sqlParams: {
            id: req.user!.id
        }
    })
}