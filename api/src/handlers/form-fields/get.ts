import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getFormFields(req: FastifyRequest, res: FastifyReply) {
    await readEntity(
        req,
        res,
        'form-fields/get.sql'
    )
}
