import type { FastifyReply, FastifyRequest } from 'fastify'
import run, { runInTransaction } from '#db'
import { loadSQL } from '#utils/sql.ts'
import { sendTemplatedMail } from '#utils/sendSMTP.ts'
import config from '#constants'

export default async function createSubmission(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    const { id: formId } = req.params as { id: string }

    try {
        const result = await runInTransaction(async (client) => {
            await client.query('SELECT 1 FROM forms WHERE id = $1 FOR UPDATE', [formId])

            const formQuery = await loadSQL('forms/get.sql')
            const formResult = await client.query(formQuery, [formId])
            
            if (formResult.rows.length === 0) {
                const error = new Error('Form not found');
                (error as any).statusCode = 404
                throw error
            }
            const form = formResult.rows[0]

            if (!form.anonymous_submissions && !req.user?.id) {
                const error = new Error('Authentication required');
                (error as any).statusCode = 401
                throw error
            }

            const userId = form.anonymous_submissions ? null : req.user!.id
            let status = 'confirmed'
            
            if (!form.anonymous_submissions && !form.multiple_submissions && userId) {
                const checkSubmissionSql = await loadSQL('submissions/checkUserSubmission.sql')
                const existingSubmission = await client.query(checkSubmissionSql, [formId, userId])
                if (parseInt(existingSubmission.rows[0].count) > 0) {
                    throw new Error('You have already submitted to this form')
                }
            }
            
            if (form.limit) {
                const currentCount = parseInt(form.confirmed_count) || 0
                if (currentCount >= form.limit) {
                    if (form.waitlist) {
                        status = 'waitlisted'
                    } else {
                        const error = new Error('Form is full');
                        (error as any).statusCode = 400
                        throw error
                    }
                }
            }

            const submissionSql = await loadSQL('submissions/post.sql')
            const submissionResult = await client.query(submissionSql, [formId, userId, status])
            const submissionId = submissionResult.rows[0].id

            const dataSql = await loadSQL('submissions/postData.sql')
            for (const { field_id, value } of body.fields || []) {
                await client.query(dataSql, [submissionId, field_id, value])
            }
            
            return { submissionId, form, status }
        })

        const { submissionId, form, status } = result

        try {
            if (req.user?.email) {
                const isWaitlisted = status === 'waitlisted'
                const subject = isWaitlisted 
                    ? `Venteliste bekreftelse - ${form.title}`
                    : `Skjema bekreftelse - ${form.title}`
                
                const header = isWaitlisted ? 'Du er på venteliste' : 'Skjema bekreftelse'
                
                const content = isWaitlisted
                    ? `Du er satt på venteliste for "${form.title}".\n` +
                      `Vi gir deg beskjed hvis du får plass.\n` +
                      `\nAnsvarlig for skjemaet: <a href="mailto:${form.creator_email}">${form.creator_email}</a> \n`
                    : `Din påmelding til "${form.title}" er levert.\n` +
                      `\nAnsvarlig for skjemaet: <a href="mailto:${form.creator_email}">${form.creator_email}</a> \n`

                await sendTemplatedMail(req.user.email, {
                    title: subject,
                    header: header,
                    content: content,
                    actionUrl: `${config.FRONTEND_URL}/submissions/${submissionId}`,
                    actionText: 'View Submission'

                })
            }
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError)
        }

        res.status(201).send({ id: submissionId })
    } catch (error: any) {
        if (error.statusCode) {
            return res.status(error.statusCode).send({ error: error.message })
        }
        console.error('Error creating submission:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}