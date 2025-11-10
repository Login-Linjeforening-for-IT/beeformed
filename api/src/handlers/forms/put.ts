import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateEntity } from '../../utils/crud.ts'

export default async function updateForm(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any

    await updateEntity({
        res,
        sqlPath: 'forms/put.sql',
        requiredFields: ['title'],
        sqlParams: {
            id:                     params.id,
            title:                  body.title,
            description:            body.description || null,
            is_active:              body.is_active || false,
            anonymous_submissions:  body.anonymous_submissions || false,
            limit:                  body.limit || null,
            published_at:           body.published_at || new Date(),
            expires_at:             body.expires_at || null
        }
    })
}