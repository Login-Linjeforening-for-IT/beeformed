import type { FastifyRequest } from 'fastify'
import type { WebSocket } from '@fastify/websocket'
import run from '#db'
import { loadSQL } from '#utils/sql.ts'

interface LiveCountData {
    registered_count: number
    limit: number | null
    spaces_left: number | null
}

const connections = new Map<string, Set<WebSocket>>()
const intervals = new Map<string, ReturnType<typeof setInterval>>()
const lastData = new Map<string, LiveCountData>()

const pollInternalMs = 10_000

async function fetchCount(formId: string): Promise<LiveCountData | null> {
    const sql = await loadSQL('submissions/liveCount.sql')
    const result = await run(sql, [formId])
    if (result.rows.length === 0) return null
    const row = result.rows[0] as { registered_count: number; limit: number | null }
    const spaces_left = row.limit !== null ? Math.max(0, row.limit - row.registered_count) : null
    return { registered_count: row.registered_count, limit: row.limit, spaces_left }
}

function broadcast(formId: string, data: LiveCountData) {
    const sockets = connections.get(formId)
    if (!sockets) return
    const message = JSON.stringify(data)
    for (const socket of sockets) {
        if (socket.readyState === socket.OPEN) {
            socket.send(message)
        }
    }
}

function startPolling(formId: string) {
    if (intervals.has(formId)) return

    const interval = setInterval(async () => {
        const sockets = connections.get(formId)
        if (!sockets || sockets.size === 0) {
            clearInterval(interval)
            intervals.delete(formId)
            lastData.delete(formId)
            return
        }

        try {
            const data = await fetchCount(formId)
            if (!data) return

            const last = lastData.get(formId)
            if (!last || last.registered_count !== data.registered_count) {
                lastData.set(formId, data)
                broadcast(formId, data)
            }
        } catch (err) {
            console.error('[liveCount] Poll error for form', formId, err)
        }
    }, pollInternalMs)

    intervals.set(formId, interval)
}

export default async function liveCountHandler(socket: WebSocket, req: FastifyRequest) {
    const { id: formId } = req.params as { id: string }

    if (!connections.has(formId)) {
        connections.set(formId, new Set())
    }
    connections.get(formId)!.add(socket)

    try {
        const data = await fetchCount(formId)
        if (data) {
            lastData.set(formId, data)
            socket.send(JSON.stringify(data))
        }
    } catch (err) {
        console.error('[liveCount] Initial fetch error for form', formId, err)
    }

    startPolling(formId)

    socket.on('close', () => {
        const sockets = connections.get(formId)
        if (sockets) {
            sockets.delete(socket)
            if (sockets.size === 0) {
                connections.delete(formId)
                const interval = intervals.get(formId)
                if (interval) {
                    clearInterval(interval)
                    intervals.delete(formId)
                }
                lastData.delete(formId)
            }
        }
    })
}
