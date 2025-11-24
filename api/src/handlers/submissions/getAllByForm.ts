import type { FastifyReply, FastifyRequest } from 'fastify'
import { readEntity } from '../../utils/crud.ts'
import run from '../../db.ts'
import { loadSQL } from '../../utils/sql.ts'

export default async function getSubmissionsByForm(req: FastifyRequest, res: FastifyReply) {
    const { id: formId } = req.params as { id: string }
    const userId = req.user!.id

    try {
        const formQuery = await loadSQL('forms/get.sql')
        const formResult = await run(formQuery, [formId])
        if (formResult.rows.length === 0 || formResult.rows[0].user_id !== userId) {
            return res.status(403).send({ error: 'Forbidden' })
        }

        return readEntity({
            res,
            sqlPath: 'submissions/getAllByForm.sql',
            sqlParams: [formId]
        })
    } catch (error) {
        console.error('Error getting submissions:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}