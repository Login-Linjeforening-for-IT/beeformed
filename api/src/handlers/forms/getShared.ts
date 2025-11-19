import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'
import { buildFilteredQuery } from '../../utils/sql.ts'

export default async function getSharedForms(req: FastifyRequest, res: FastifyReply) {
    const query = req.query as {
        search?: string
        limit?: string
        offset?: string
        order_by?: string
        sort?: string
    }

    try {
        const { sql, params } = await buildFilteredQuery('forms/getShared.sql', [req.user!.id], query, 'f')

        await readEntity({
            res,
            sql,
            sqlParams: params,
            metadata: (data: unknown[]) => {
                const total = data.length > 0 ? (data[0] as Record<string, unknown>).total_count as number : 0
                return { total }
            }
        })
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid order_by parameter') {
            return res.status(400).send({ error: error.message })
        }
        console.error('Error getting shared forms:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}