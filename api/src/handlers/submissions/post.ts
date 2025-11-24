import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '../../db.ts'
import { loadSQL } from '../../utils/sql.ts'

export default async function createSubmission(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    const { id: formId } = req.params as { id: string }

    try {
        const formQuery = await loadSQL('forms/get.sql')
        const formResult = await run(formQuery, [formId])
        if (formResult.rows.length === 0) {
            return res.status(404).send({ error: 'Form not found' })
        }
        const form = formResult.rows[0]

        if (!form.anonymous_submissions && !req.user!.id) {
            return res.status(401).send({ error: 'Authentication required' })
        }

        const userId = form.anonymous_submissions ? null : req.user!.id

        const submissionSql = await loadSQL('submissions/post.sql')
        const submissionResult = await run(submissionSql, [formId, userId])
        const submissionId = submissionResult.rows[0].id

        const dataSql = await loadSQL('submissions/postData.sql')
        for (const { field_id, value } of body.fields || []) {
            await run(dataSql, [submissionId, field_id, value])
        }

        res.status(201).send({ id: submissionId })
    } catch (error) {
        console.error('Error creating submission:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}