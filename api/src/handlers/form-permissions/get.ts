import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getFormPermissions(req: FastifyRequest, res: FastifyReply) {
    const params = req.params as any
    await readEntity({
        req,
        res,
        sqlPath: 'form-permissions/get.sql',
        sqlParams: [params.id]
    })
}
