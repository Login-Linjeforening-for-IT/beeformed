import type { FastifyInstance } from 'fastify'

import getIndex from './handlers/index/getIndex.ts'
import getPing from './handlers/ping/get.ts'

import authMiddleware from './utils/authMiddleware.ts'
import permissionMiddleware from './utils/permissionMiddleware.ts'

import {
    createUser,
    getUser,
    deleteUser
} from './handlers/users/index.ts'

import {
    createForm,
    getForms,
    getSharedForms,
    getForm,
    getPublicForm,
    updateForm,
    deleteForm
} from './handlers/forms/index.ts'

import {
    createFormPermission,
    getFormPermission,
    deleteFormPermission
} from './handlers/form-permissions/index.ts'

import {
    getFormFields,
    bulkFormFields
} from './handlers/form-fields/index.ts'

import {
    createSubmission,
    getSubmission,
    getSubmissionsByForm,
    getSubmissionsByUser
} from './handlers/submissions/index.ts'



export default async function apiRoutes(fastify: FastifyInstance) {
    // index
    fastify.get('/', getIndex)

    // ping
    fastify.get('/ping', getPing)

    // Users
    fastify.post('/users', { preHandler: authMiddleware }, createUser)
    fastify.get('/users', { preHandler: authMiddleware }, getUser)
    fastify.delete('/users', { preHandler: authMiddleware }, deleteUser)

    // Forms
    fastify.post('/forms', { preHandler: authMiddleware }, createForm)
    fastify.get('/forms', { preHandler: authMiddleware }, getForms)
    fastify.get('/forms/shared', { preHandler: authMiddleware }, getSharedForms)
    fastify.get('/forms/:id', { preHandler: [authMiddleware, permissionMiddleware] }, getForm)
    fastify.get('/forms/:id/public', getPublicForm)
    fastify.put('/forms/:id', { preHandler: [authMiddleware, permissionMiddleware] }, updateForm)
    fastify.delete('/forms/:id', { preHandler: [authMiddleware, permissionMiddleware] }, deleteForm)

    // Form Permissions
    fastify.get('/forms/:id/permissions', { preHandler: [authMiddleware, permissionMiddleware] }, getFormPermission)
    fastify.post('/forms/:id/permissions', { preHandler: [authMiddleware, permissionMiddleware] }, createFormPermission)
    fastify.delete('/forms/:formId/permissions/:id', { preHandler: [authMiddleware, permissionMiddleware] }, deleteFormPermission)

    // Form Fields
    fastify.get('/forms/:id/fields', { preHandler: [authMiddleware, permissionMiddleware] }, getFormFields)
    fastify.patch('/forms/:id/fields', { preHandler: [authMiddleware, permissionMiddleware] }, bulkFormFields)

    // Submissions
    fastify.get('/forms/:id/submissions', { preHandler: [authMiddleware, permissionMiddleware] }, getSubmissionsByForm)
    fastify.post('/forms/:id/submissions', { preHandler: authMiddleware }, createSubmission)
    fastify.get('/submissions/:id', { preHandler: authMiddleware }, getSubmission)
    fastify.get('/submissions', { preHandler: authMiddleware }, getSubmissionsByUser)
}
