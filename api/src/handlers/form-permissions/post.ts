import type { FastifyReply, FastifyRequest } from 'fastify'
import { createEntity } from '../../utils/crud.ts'
import run from '../../db.ts'

export default async function createFormPermission(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any

    if(!body.user_email && !body.group) {
        return res.status(400).send({ error: 'At least one of user_email or group must be defined' })
    }

    if (body.user_email && body.group) {
        return res.status(400).send({ error: 'Only one of user_email or group can be defined' })
    }

    let userId = null
    if (body.user_email) {
        const userQuery = 'SELECT user_id FROM users WHERE email = $1'
        const userResult = await run(userQuery, [body.user_email])
        if (userResult.rows.length === 0) {
            return res.status(400).send({ error: 'User with this email not found' })
        }
        userId = userResult.rows[0].user_id
    }

    await createEntity({
        res,
        sqlPath: 'form-permissions/post.sql',
        requiredFields: ['form_id', 'granted_by'],
        sqlParams: {
            form_id:    params.id,
            user_id:    userId || null,
            group:      body.group || null,
            granted_by: req.user!.id
        }
    })
}
