import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getFormPermissions(req: FastifyRequest, res: FastifyReply) {
    await readEntity(
        req,
        res,
        'form-permissions/get.sql'
    )
}
