import type { FastifyReply, FastifyRequest } from 'fastify'
import { checkPermission } from './checkPermissions.ts'

export default async function permissionMiddleware(req: FastifyRequest<{ Params: { id?: string, formId?: string } }>, res: FastifyReply) {
    const id = req.params.id || req.params.formId
    const userId = req.user?.id

    if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' })
    }

    if (!id) {
        return res.status(400).send({ error: 'Missing form ID' })
    }

    const hasPermission = await checkPermission(parseInt(id), userId)

    if (!hasPermission) {
        return res.status(403).send({ error: 'Forbidden' })
    }
}
