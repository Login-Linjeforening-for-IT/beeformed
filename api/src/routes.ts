import getIndex from './handlers/index/getIndex.ts'
import {
    createUser,
    deleteUser
} from './handlers/users/index.ts'
import { createForm, getForm, updateForm, deleteForm } from './handlers/forms/index.ts'
import type { FastifyInstance } from 'fastify'

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
}
