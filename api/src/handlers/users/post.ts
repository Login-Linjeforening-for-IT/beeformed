import type { FastifyReply, FastifyRequest } from 'fastify'

import { createEntity } from '../../utils/crud.ts'

export default async function createUser(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    await createEntity({
        req,
        res,
        sqlPath: 'users/post.sql',
        requiredFields: ['user_id', 'email'],
        sqlParams: [
            body.user_id,
            body.email,
            body.name || null
        ]
    })
}
