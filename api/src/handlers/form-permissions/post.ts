import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'
import { loadSQL } from '#utils/sql.ts'

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

    const form_id = params.id
    const granted_by = req.user!.id
    const group = body.group || null
    const user_id = userId || null

    if (!form_id || !granted_by) {
        return res.status(400).send({ error: 'form_id and granted_by are required' })
    }

    const formCheckQuery = 'SELECT user_id FROM forms WHERE id = $1'
    const formCheckResult = await run(formCheckQuery, [form_id])
    if (formCheckResult.rows.length === 0) {
        return res.status(404).send({ error: 'Form not found' })
    }
    if (formCheckResult.rows[0].user_id !== granted_by) {
        return res.status(403).send({ error: 'Forbidden' })
    }

    try {
        const sql = await loadSQL('form-permissions/post.sql')
        const result = await run(sql, [form_id, user_id, group, granted_by])
        res.status(201).send(result.rows[0])
    } catch (error) {
        console.error('Error creating entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}
