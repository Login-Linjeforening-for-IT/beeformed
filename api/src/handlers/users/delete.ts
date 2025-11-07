import type { FastifyReply, FastifyRequest } from 'fastify'

import { deleteEntity } from '../../utils/crud'

export default async function deleteUser(req: FastifyRequest, res: FastifyReply) {
    await deleteEntity(req, res, 'users/delete.sql')
}