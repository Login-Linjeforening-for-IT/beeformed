import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'
import { loadSQL } from '#utils/sql.ts'
import { sendTemplatedMail } from '#utils/sendSMTP.ts'
import config from '#constants'

export default async function deleteSubmission(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = req.params as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = req.user as any

    try {
        const getSql = await loadSQL('submissions/getForDeletion.sql')
        const getResult = await run(getSql, [params.id])

        if (getResult.rows.length === 0) {
            return res.status(404).send({ error: 'Submission not found' })
        }

        const submission = getResult.rows[0]

        if (submission.user_id !== user.id && submission.form_owner_id !== user.id) {
             return res.status(403).send({ error: 'You do not have permission to delete this submission' })
        }

        const now = new Date()
        const expiresAt = new Date(submission.expires_at)
        if (now > expiresAt) {
             return res.status(400).send({ error: 'Cannot remove submission after form has closed' })
        }

        const deleteSql = await loadSQL('submissions/delete.sql')
        await run(deleteSql, [params.id])

        if (submission.user_email) {
            const isOwner = submission.user_id === user.id
            await sendTemplatedMail(submission.user_email, {
                header: isOwner ? 'Submission Withdrawn' : 'Submission Removed',
                title: isOwner 
                    ? `You have withdrawn your submission for ${submission.form_title}`
                    : `Your submission for ${submission.form_title} has been removed`,
                content: isOwner
                    ? `We're confirming that your submission for ${submission.form_title} has been removed.`
                    : `An administrator has removed your submission for ${submission.form_title}.`,
                actionUrl: `${config.FRONTEND_URL}/f/${submission.form_slug}`,
                actionText: 'View Form'
            })
        }

        if (submission.status === 'confirmed' && submission.limit !== null) {
            const countSql = await loadSQL('submissions/countConfirmed.sql')
            const countResult = await run(countSql, [submission.form_id])
            const confirmedCount = countResult.rows[0].count

            if (confirmedCount < submission.limit) {
                const getWaitlistSql = await loadSQL('submissions/getWaitlistBatch.sql')
                const updateStatusSql = await loadSQL('submissions/updateStatus.sql')
                
                const waitlistResult = await run(getWaitlistSql, [submission.form_id, 1])
                
                if (waitlistResult.rows.length > 0) {
                    const nextPerson = waitlistResult.rows[0]
                    await run(updateStatusSql, [nextPerson.id, 'confirmed'])
                    
                    if (nextPerson.email) {
                        await sendTemplatedMail(nextPerson.email, {
                            header: 'Good news!',
                            title: `You have a spot in ${submission.form_title}!`,
                            content: `Your submission for ${submission.form_title} has been confirmed. A spot opened up and you have been moved from the waitlist to confirmed list.`,
                            actionUrl: `${config.FRONTEND_URL}/submissions/${nextPerson.id}`,
                            actionText: 'View Submission'
                        })
                    }
                }
            }
        }

        res.send({ success: true, message: 'Submission deleted' })

    } catch (error) {
        console.error('Error deleting submission:', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}
