import type { FastifyReply, FastifyRequest } from 'fastify'
import run, { runInTransaction } from '../../db.ts'
import { loadSQL } from '../../utils/sql.ts'
import { sendTemplatedMail } from '../../utils/sendSMTP.ts'

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

        const submissionId = await runInTransaction(async (client) => {
            const submissionSql = await loadSQL('submissions/post.sql')
            const submissionResult = await client.query(submissionSql, [formId, userId])
            const submissionId = submissionResult.rows[0].id

            const dataSql = await loadSQL('submissions/postData.sql')
            for (const { field_id, value } of body.fields || []) {
                await client.query(dataSql, [submissionId, field_id, value])
            }
            return submissionId
        })

        try {
            if (req.user?.email) {
                await sendTemplatedMail(req.user.email, {
                    title: `Skjema bekreftelse - ${form.title}`,
                    header: 'Skjema bekreftelse',
                    content:
                        `Din påmelding til "${form.title}" er levert.\n` +
                        `\nAnsvarlig for skjemaet: <a href="mailto:${form.creator_email}">${form.creator_email}</a> \n`
                })
            }
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError)
        }

        res.status(201).send({ id: submissionId })
    } catch (error) {
        console.error('Error creating submission:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}