import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'
import { loadSQL } from '#utils/sql.ts'
import { sendTemplatedMail } from '#utils/sendSMTP.ts'

export default async function updateForm(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = req.body as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any

    if (!body.slug || !body.title || !body.published_at || !body.expires_at) {
        return res.status(400).send({ error: 'slug, title, published_at and expires_at are required' })
    }

    const publishedAt = new Date(body.published_at)
    const expiresAt = new Date(body.expires_at)
    if (isNaN(publishedAt.getTime()) || isNaN(expiresAt.getTime())) {
        return res.status(400).send({ error: 'publish date and expires_at must be valid dates' })
    }
    else if (publishedAt >= expiresAt) {
        return res.status(400).send({ error: 'expire date must be later than published_at' })
    }
    else if (expiresAt.getTime() - new Date().getTime() > 365 * 24 * 60 * 60 * 1000) {
        return res.status(400).send({ error: 'expire date cannot be more than one year in the future' })
    }

    try {
        const newLimit = body.limit ? Number(body.limit) : null

        // Get confirmed count
        const countSql = await loadSQL('submissions/countConfirmed.sql')
        const countResult = await run(countSql, [params.id])
        const confirmedCount = countResult.rows[0].count

        if (newLimit !== null && newLimit < confirmedCount) {
            return res.status(400).send({ error: 'Limit cannot be lower than the number of confirmed submissions' })
        }

        let spotsToFill = 0
        if (newLimit === null) {
            spotsToFill = 999999
        } else {
            spotsToFill = newLimit - confirmedCount
        }

        if (spotsToFill > 0) {
            const getWaitlistSql = await loadSQL('submissions/getWaitlistBatch.sql')
            const updateStatusSql = await loadSQL('submissions/updateStatus.sql')
            
            const waitlistResult = await run(getWaitlistSql, [params.id, spotsToFill])
            const toPromote = waitlistResult.rows

            for (const submission of toPromote) {
                await run(updateStatusSql, [submission.id, 'confirmed'])
                if (submission.email) {
                    await sendTemplatedMail(submission.email, {
                        header: 'Good news!',
                        title: `You have a spot in ${body.title}!`,
                        content: `Your submission for ${body.title} has been confirmed. A spot opened up and you have been moved from the waitlist to confirmed list.`,
                        actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/submissions/${submission.id}`,
                        actionText: 'View Submission'
                    })
                }
            }
        }

        const sqlParams = [
            params.id,
            body.slug,
            body.title,
            body.description || null,
            body.anonymous_submissions || false,
            body.limit || null,
            body.waitlist || false,
            publishedAt,
            expiresAt
        ]

        const sql = await loadSQL('forms/put.sql')
        const result = await run(sql, sqlParams)

        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'Entity not found' })
        }

        res.send(result.rows[0])
    } catch (error) {
        console.error('Error updating entity:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}