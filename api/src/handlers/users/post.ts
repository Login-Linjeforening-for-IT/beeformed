import type { FastifyReply, FastifyRequest } from 'fastify'

import { createEntity } from '../../utils/crud.ts'

export default async function createUser(req: FastifyRequest, res: FastifyReply) {
    await createEntity(
        req,
        res,
        'users/post.sql',
        ['user_id', 'email'],
        (params, body) => [
            body.user_id,
            body.email,
            body.name || null
        ]
    )
}
