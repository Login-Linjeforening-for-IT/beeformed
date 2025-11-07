import getIndex from './handlers/index/getIndex.ts'
import {
    createUser,
    deleteUser
} from './handlers/users/index.ts'
import type { FastifyInstance } from 'fastify'

export default async function apiRoutes(fastify: FastifyInstance) {
    // index
    fastify.get('/', getIndex)

    // Users
    fastify.post('/users', createUser)
    fastify.delete('/users/:id', deleteUser)
}
