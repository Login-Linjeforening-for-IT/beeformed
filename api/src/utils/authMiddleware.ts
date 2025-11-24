import type { FastifyReply, FastifyRequest } from 'fastify'
import checkToken from '../utils/checkToken.ts'

declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            id: string
            name: string
            email: string
        }
    }
}

export default async function authMiddleware(req: FastifyRequest, res: FastifyReply) {
    const tokenResult = await checkToken(req, res)
    if (!tokenResult.valid || !tokenResult.userInfo || !tokenResult.userInfo.sub) {
        return res.status(401).send({ error: tokenResult.error || 'Invalid user information' })
    }

    req.user = {
        id: tokenResult.userInfo.sub,
        name: tokenResult.userInfo.name,
        email: tokenResult.userInfo.email
    }
}