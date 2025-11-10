import type { FastifyReply, FastifyRequest } from 'fastify'
import { createEntity } from '../../utils/crud.ts'

export default async function createUser(req: FastifyRequest, res: FastifyReply) {
    await createEntity({
        req,
        res,
        sqlPath: 'users/post.sql',
        requiredFields: ['user_id', 'email', 'name'],
        sqlParams: {
            user_id: req.user!.id,
            email: req.user!.email,
            name: req.user!.name,
        }
    })
}
