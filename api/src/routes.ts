import getIndex from './handlers/index/getIndex.ts'
import type { FastifyInstance } from 'fastify'

export default async function apiRoutes(fastify: FastifyInstance) {
    // index
    fastify.get('/', getIndex)
}
