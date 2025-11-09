import type { FastifyReply, FastifyRequest } from 'fastify'
import checkToken from '../utils/checkToken.ts'

declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            id: string
        }
    }
}

export default async function authMiddleware(req: FastifyRequest, res: FastifyReply) {
    const tokenResult = await checkToken(req, res)
    if (!tokenResult.valid) {
        return res.status(401).send({ error: tokenResult.error })
    }

    req.user = { id: tokenResult.userInfo.sub! }
}