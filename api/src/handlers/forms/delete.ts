import type { FastifyReply, FastifyRequest } from 'fastify'
import { deleteEntity } from '../../utils/crud.ts'

export default async function deleteForm(req: FastifyRequest, res: FastifyReply) {
    await deleteEntity(req, res, 'forms/delete.sql')
}