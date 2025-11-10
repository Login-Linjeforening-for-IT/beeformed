import type { FastifyReply, FastifyRequest } from 'fastify'
import { createEntity } from '../../utils/crud.ts'

type CreateUserBody = {
    email: string
    name: string
}

export default async function createUser(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as CreateUserBody
    await createEntity({
        req,
        res,
        sqlPath: 'users/post.sql',
        requiredFields: ['user_id', 'email', 'name'],
        sqlParams: [
            req.user!.id,
            body.email,
            body.name
        ]
    })
}
