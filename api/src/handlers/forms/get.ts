import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'

export default async function getForm(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any
    await readEntity({
        res,
        sqlPath: 'forms/getOne.sql',
        requiredFields: ['id'],
        sqlParams: {
            id: params.id
        },
    })
}