import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '../../db.ts'
import { loadSQL, buildFilteredQuery } from '../../utils/sql.ts'

export default async function getSubmissionsByForm(req: FastifyRequest, res: FastifyReply) {
    const { id: formId } = req.params as { id: string }
    const userId = req.user!.id
    const query = req.query as {
        search?: string
        limit?: string
        offset?: string
        order_by?: string
        sort?: string
    }

    try {
        const formQuery = await loadSQL('forms/get.sql')
        const formResult = await run(formQuery, [formId])
        if (formResult.rows.length === 0 || formResult.rows[0].user_id !== userId) {
            return res.status(403).send({ error: 'Forbidden' })
        }

        const orderBy = query.order_by || 'submitted_at'
        const orderMap: Record<string, string> = {
            submitted_at: 's.submitted_at',
            id: 's.id',
            form_id: 's.form_id',
            form_title: 'f.title',
            user_name: 'u.name',
            user_email: 'u.email'
        }
        if (!orderMap[orderBy]) {
            return res.status(400).send({ error: 'Invalid order_by parameter' })
        }

        const { sql, params } = await buildFilteredQuery(
            'submissions/getAllByForm.sql',
            [formId],
            query,
            undefined,
            {
                searchFields: ['u.email', 'u.name', 's.id::text'],
                explicitOrderField: orderMap[orderBy]
            }
        )
        const result = await run(sql, params)
        const data = result.rows
        const total = data.length > 0 ? (data[0] as Record<string, unknown>).total_count as number : 0

        res.send({ data, total })
    } catch (error) {
        console.error('Error getting submissions:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}