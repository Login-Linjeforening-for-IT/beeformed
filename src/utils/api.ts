'use server'

import {
    getWrapper,
    deleteWrapper,
    postWrapper,
    putWrapper,
    patchWrapper,
} from './apiWrapper'

type FilterProps = {
    search?: string
    offset?: number
    limit?: number
    orderBy?: string
    sort?: 'asc' | 'desc'
}

type ErrorResponse = {
    error: string
}

// User
export async function getUser() {
    return getWrapper({ path: 'users' })
}

export async function deleteUser() {
    return deleteWrapper({ path: 'users' })
}

// Forms
export async function getForms({search, offset, limit, orderBy, sort}: FilterProps = {}): Promise<GetFormsProps | ErrorResponse> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const result = await getWrapper({ path: `forms?${queryParts.toString()}` })
    return result
}

export async function getSharedForms({search, offset, limit, orderBy, sort}: FilterProps = {}): Promise<GetFormsProps | ErrorResponse> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (limit)      queryParts.append('limit', String(limit))
    if (offset)     queryParts.append('offset', String(offset))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const result = await getWrapper({ path: `forms/shared?${queryParts.toString()}` })
    return result
}

export async function getForm(formId: string): Promise<GetFormProps | ErrorResponse> {
    return getWrapper({ path: `forms/${formId}` })
}

export async function getPublicForm(formId: string): Promise<GetPublicFormProps | ErrorResponse> {
    return getWrapper({ path: `forms/${formId}/public` })
}

export async function postForm(data: PostFormProps) {
    return postWrapper({ path: 'forms', data })
}

export async function putForm(formId: number, data: PutFormProps) {
    return putWrapper({ path: `forms/${formId}`, data })
}

export async function deleteForm(formId: string) {
    return deleteWrapper({ path: `forms/${formId}` })
}

// Fields
export async function getFields(formId: string): Promise<GetFieldsProps | ErrorResponse> {
    return getWrapper({ path: `forms/${formId}/fields` })
}

export async function patchFields(formId: string, data: PatchFieldsProps) {
    return patchWrapper({ path: `forms/${formId}/fields`, data })
}

// Permissions
export async function getPermissions(formId: string): Promise<GetPermissionsProps | ErrorResponse> {
    return getWrapper({ path: `forms/${formId}/permissions` })
}

export async function postPermission(formId: string, data: PostPermissionProps) {
    return postWrapper({ path: `forms/${formId}/permissions`, data })
}

export async function deletePermission(formId: string, permissionId: string) {
    return deleteWrapper({ path: `forms/${formId}/permissions/${permissionId}` })
}

export async function submitForm(formId: string, data: { fields: { field_id: number; value: string }[] }) {
    return postWrapper({ path: `forms/${formId}/submit`, data })
}
