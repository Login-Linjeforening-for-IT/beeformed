'use server'

import {
    getWrapper,
    deleteWrapper,
    postWrapper,
    putWrapper,
    patchWrapper,
} from '@utils/apiWrapper'

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
    return await getWrapper({ path: 'users' })
}

export async function deleteUser() {
    return await deleteWrapper({ path: 'users' })
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
    return await getWrapper({ path: `forms/${formId}` })
}

export async function getPublicForm(formId: string): Promise<GetPublicFormProps | ErrorResponse> {
    return await getWrapper({ path: `forms/${formId}/public` })
}

export async function postForm(data: PostFormProps): Promise<{id: number} | ErrorResponse> {
    return await postWrapper({ path: 'forms', data })
}

export async function putForm(formId: number, data: PutFormProps) {
    return await putWrapper({ path: `forms/${formId}`, data })
}

export async function deleteForm(formId: string) {
    return await deleteWrapper({ path: `forms/${formId}` })
}

// Fields
export async function getFields(formId: string): Promise<GetFieldsProps | ErrorResponse> {
    return await getWrapper({ path: `forms/${formId}/fields` })
}

export async function patchFields(formId: string, data: PatchFieldsProps) {
    return await patchWrapper({ path: `forms/${formId}/fields`, data })
}

// Permissions
export async function getPermissions(formId: string): Promise<GetPermissionsProps | ErrorResponse> {
    return await getWrapper({ path: `forms/${formId}/permissions` })
}

export async function postPermission(formId: string, data: PostPermissionProps) {
    return await postWrapper({ path: `forms/${formId}/permissions`, data })
}

export async function deletePermission(formId: string, permissionId: string) {
    return await deleteWrapper({ path: `forms/${formId}/permissions/${permissionId}` })
}

// Submissions
export async function getSubmissions(
    formId: string,
    { search, offset, limit, orderBy, sort }: FilterProps = {}
): Promise<GetSubmissionsProps | ErrorResponse> {
    const queryParts = new URLSearchParams()
    if (search) queryParts.append('search', String(search))
    if (limit) queryParts.append('limit', String(limit))
    if (offset) queryParts.append('offset', String(offset))
    if (orderBy) queryParts.append('order_by', String(orderBy))
    if (sort) queryParts.append('sort', String(sort))

    const result = await getWrapper({ path: `forms/${formId}/submissions?${queryParts.toString()}` })
    return result
}

export async function postSubmission(formId: string, data: PostSubmissionProps) {
    return await postWrapper({ path: `forms/${formId}/submissions`, data })
}

export async function getSubmission(submissionId: string): Promise<Submission | ErrorResponse> {
    return await getWrapper({ path: `submissions/${submissionId}` })
}

export async function deleteSubmission(submissionId: string) {
    return await deleteWrapper({ path: `submissions/${submissionId}` })
}

export async function getUserSubmissions(
    { search, offset, limit, orderBy, sort }: FilterProps = {}
): Promise<GetSubmissionsProps | ErrorResponse> {
    const queryParts = new URLSearchParams()
    if (search) queryParts.append('search', String(search))
    if (limit) queryParts.append('limit', String(limit))
    if (offset) queryParts.append('offset', String(offset))
    if (orderBy) queryParts.append('order_by', String(orderBy))
    if (sort) queryParts.append('sort', String(sort))

    const result = await getWrapper({ path: `submissions?${queryParts.toString()}` })
    return result
}