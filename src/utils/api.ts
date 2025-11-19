'use server'

import {
    getWrapper,
    deleteWrapper,
    postWrapper,
} from './apiWrapper'

type FilterProps = {
    search?: string
    offset?: number
    limit?: number
    orderBy?: string
    sort?: 'asc' | 'desc'
}

// User
export async function getUser() {
    return getWrapper({ path: 'users' })
}

export async function deleteUser() {
    return deleteWrapper({ path: 'users' })
}

// Forms
export async function getForms({search, offset, limit, orderBy, sort}: FilterProps = {}) {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const result = await getWrapper({ path: `forms?${queryParts.toString()}` })
    return result
}

export async function getSharedForms({search, offset, limit, orderBy, sort}: FilterProps = {}) {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const result = await getWrapper({ path: `forms/shared?${queryParts.toString()}` })
    return result
}

export async function getForm(formId: string) {
    return getWrapper({ path: `forms/${formId}` })
}

export async function postForm(data: PostFormProps) {
    return postWrapper({ path: 'forms', data })
}

export async function putForm(formId: string, data: PutFormProps) {
    return postWrapper({ path: `forms/${formId}`, data })
}

export async function deleteForm(formId: string) {
    return deleteWrapper({ path: `forms/${formId}` })
}

