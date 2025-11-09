import type { FastifyInstance } from 'fastify'

import getIndex from './handlers/index/getIndex.ts'

import {
    createUser,
    deleteUser
} from './handlers/users/index.ts'

import { 
    createForm,
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
    bulkFormFields
} from './handlers/form-fields/index.ts'



export default async function apiRoutes(fastify: FastifyInstance) {
    // index
    fastify.get('/', getIndex)

    // Users
    fastify.post('/users', createUser)
    fastify.delete('/users/:id', deleteUser)

    // Forms
    fastify.post('/forms', createForm)
    fastify.get('/forms/:id', getForm)
    fastify.put('/forms/:id', updateForm)
    fastify.delete('/forms/:id', deleteForm)

    // Form Permissions
    fastify.get('/forms/:id/permissions', getFormPermission)
    fastify.post('/forms/:id/permissions', createFormPermission)
    fastify.put('/forms/:id/permissions', updateFormPermission)
    fastify.delete('/forms/:id/permissions', deleteFormPermission)

    // Form Fields
    fastify.patch('/forms/:id/fields/bulk', bulkFormFields)
}
