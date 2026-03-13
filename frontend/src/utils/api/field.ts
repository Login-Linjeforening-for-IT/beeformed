'use server'

import apiRequest from './apiWrapper'

export async function getFields(formId: string): Promise<GetFieldsProps> {
    return apiRequest({ method: 'GET', path: `forms/${formId}/fields` })
}

export async function patchFields(formId: string, data: PatchFieldsProps) {
    return apiRequest({ method: 'PATCH', path: `forms/${formId}/fields`, data })
}
