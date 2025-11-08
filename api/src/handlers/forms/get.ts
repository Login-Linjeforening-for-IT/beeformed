import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getForm(req: FastifyRequest, res: FastifyReply) {
    await readEntity(req, res, 'forms/getOne.sql')
}