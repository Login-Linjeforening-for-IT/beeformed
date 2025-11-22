import type { FastifyInstance } from 'fastify'

import getIndex from './handlers/index/getIndex.ts'
import authMiddleware from './utils/authMiddleware.ts'

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
    updateForm,
    deleteForm
} from './handlers/forms/index.ts'

import {
    createFormPermission,
    getFormPermission,
    updateFormPermission,
    deleteFormPermission
} from './handlers/form-permissions/index.ts'

import {
    getFormFields,
    bulkFormFields
} from './handlers/form-fields/index.ts'



export default async function apiRoutes(fastify: FastifyInstance) {
    // index
    fastify.get('/', getIndex)

    // Users
    fastify.post('/users', { preHandler: authMiddleware }, createUser)
    fastify.get('/users', { preHandler: authMiddleware }, getUser)
    fastify.delete('/users', { preHandler: authMiddleware }, deleteUser)

    // Forms
    fastify.post('/forms', { preHandler: authMiddleware }, createForm)
    fastify.get('/forms', { preHandler: authMiddleware }, getForms)
    fastify.get('/forms/shared', { preHandler: authMiddleware }, getSharedForms)
    fastify.get('/forms/:id', { preHandler: authMiddleware }, getForm)
    fastify.put('/forms/:id', { preHandler: authMiddleware }, updateForm)
    fastify.delete('/forms/:id', { preHandler: authMiddleware }, deleteForm)

    // Form Permissions
    fastify.get('/forms/:id/permissions', { preHandler: authMiddleware }, getFormPermission)
    fastify.post('/forms/:id/permissions', { preHandler: authMiddleware }, createFormPermission)
    fastify.put('/forms/:formId/permissions/:id', { preHandler: authMiddleware }, updateFormPermission)
    fastify.delete('/forms/:formId/permissions/:id', { preHandler: authMiddleware }, deleteFormPermission)

    // Form Fields
    fastify.get('/forms/:id/fields', { preHandler: authMiddleware }, getFormFields)
    fastify.patch('/forms/:id/fields', { preHandler: authMiddleware }, bulkFormFields)
}
