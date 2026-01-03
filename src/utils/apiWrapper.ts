import { cookies } from 'next/headers'
import config from '../../constants'

const baseUrl = config.url.API_URL

type ApiRequestProps = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    path: string
    data?: unknown
    options?: RequestInit
}

async function apiRequest({ method, path, data, options = {} }: ApiRequestProps) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''

    const headers: Record<string, string> = {
        Authorization: `Bearer ${access_token}`,
    }

    const defaultOptions: RequestInit = {
        method,
        headers,
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        headers['Content-Type'] = 'application/json'
        defaultOptions.body = JSON.stringify(data)
    }

    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${baseUrl}/${path}`, finalOptions)

        if (!response.ok) {
            throw new Error(await response.text())
        }

        if (response.status === 204) {
            return {}
        }

        return await response.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(error)
        return { error: error.message || error.error || 'Unknown error' }
    }
}

async function getWrapper({ path, options = {} }: { path: string; options?: RequestInit }) {
    return await apiRequest({ method: 'GET', path, options })
}

async function postWrapper({ path, data }: { path: string; data: unknown }) {
    return await apiRequest({ method: 'POST', path, data })
}

async function putWrapper({ path, data }: { path: string; data: unknown }) {
    return await apiRequest({ method: 'PUT', path, data })
}

async function deleteWrapper({ path, options }: { path: string; options?: RequestInit }) {
    return await apiRequest({ method: 'DELETE', path, options })
}

async function patchWrapper({ path, data = {}, options = {} }: { path: string; data?: unknown; options?: RequestInit }) {
    return await apiRequest({ method: 'PATCH', path, data, options })
}

export { apiRequest, getWrapper, postWrapper, putWrapper, deleteWrapper, patchWrapper }