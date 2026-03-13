'use server'

import apiRequest from './apiWrapper'

export async function getPermissions(formId: string): Promise<GetPermissionsProps> {
    return apiRequest({ method: 'GET', path: `forms/${formId}/permissions` })
}

export async function postPermission(formId: string, data: PostPermissionProps) {
    return apiRequest({ method: 'POST', path: `forms/${formId}/permissions`, data })
}

export async function deletePermission(formId: string, permissionId: string) {
    return apiRequest({ method: 'DELETE', path: `forms/${formId}/permissions/${permissionId}` })
}
