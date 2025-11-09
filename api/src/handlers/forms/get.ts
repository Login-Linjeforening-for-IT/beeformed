import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getForm(req: FastifyRequest, res: FastifyReply) {
    const params = req.params as any
    await readEntity({
        req,
        res,
        sqlPath: 'forms/getOne.sql',
        sqlParams: [params.id],
    })
}