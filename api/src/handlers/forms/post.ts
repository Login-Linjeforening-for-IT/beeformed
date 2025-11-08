import type { FastifyReply, FastifyRequest } from 'fastify'
import { runInTransaction } from '../../db.ts'
import { loadSQL } from '../../utils/sql.ts'

export default async function createForm(req: FastifyRequest, res: FastifyReply) {
    try {
        const body = req.body as any

        // Validate required fields
        if (!body.user_id || !body.title) {
            return res.status(400).send({ error: 'user_id and title are required' })
        }

        if (!Array.isArray(body.fields)) {
            return res.status(400).send({ error: 'fields must be an array' })
        }

        if (!Array.isArray(body.permissions)) {
            return res.status(400).send({ error: 'permissions must be an array' })
        }

        // Load SQL queries
        const [formSQL, fieldSQL, permissionSQL] = await Promise.all([
            loadSQL('forms/post.sql'),
            loadSQL('form-fields/post.sql'),
            loadSQL('form-permissions/post.sql')
        ])

        const result = await runInTransaction(async (client) => {
            // Insert form
            const formParams = [
                body.user_id,
                body.title,
                body.description || null,
                body.is_active !== undefined ? body.is_active : true,
                body.anonymous_submissions || false,
                body.limit || null,
                body.published_at || new Date(),
                body.expires_at || null
            ]
            const formResult = await client.query(formSQL, formParams)
            const form = formResult.rows[0]

            // Insert fields
            const fields = []
            for (const field of body.fields) {
                const fieldParams = [
                    form.id,
                    field.field_type,
                    field.label,
                    field.placeholder || null,
                    field.required || false,
                    field.options ? JSON.stringify(field.options) : null,
                    field.validation ? JSON.stringify(field.validation) : null,
                    field.field_order
                ]
                const fieldResult = await client.query(fieldSQL, fieldParams)
                fields.push(fieldResult.rows[0])
            }

            // Insert permissions
            const permissions = []
            for (const permission of body.permissions) {
                const permissionParams = [
                    form.id,
                    permission.user_id,
                    permission.group || null,
                    permission.permission_type,
                    permission.granted_by
                ]
                const permissionResult = await client.query(permissionSQL, permissionParams)
                permissions.push(permissionResult.rows[0])
            }

            return { form, fields, permissions }
        })

        res.status(201).send(result)
    } catch (error) {
        console.error('Error creating form:', error)
        res.status(500).send({ error: 'Internal server error: ' + error })
    }
}