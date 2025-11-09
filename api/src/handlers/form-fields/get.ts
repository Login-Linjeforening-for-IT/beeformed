import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getFormFields(req: FastifyRequest, res: FastifyReply) {
    const params = req.params as any
    await readEntity({
        req,
        res,
        sqlPath: 'form-fields/get.sql',
        sqlParams: [params.id]
    })
}
