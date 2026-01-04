import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'
import { buildFilteredQuery } from '#utils/sql.ts'

export default async function getSubmissionsByUser(req: FastifyRequest, res: FastifyReply) {
    const userId = req.user!.id
    const query = req.query as {
        search?: string
        limit?: string
        offset?: string
        order_by?: string
        sort?: string
    }

    try {
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
            'submissions/getAllByUser.sql',
            [userId],
            query,
            undefined,
            {
                searchFields: ['f.title', 'u.email', 'u.name'],
                explicitOrderField: orderMap[orderBy]
            }
        )
        const result = await run(sql, params)
        const data = result.rows
        const total = data.length > 0 ? (data[0] as Record<string, unknown>).total_count as number : 0

        res.send({ data, total })
    } catch (error) {
        console.error('Error reading entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}