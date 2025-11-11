'use server'

import {
    getWrapper,
    deleteWrapper,
    postWrapper,
} from './apiWrapper'

// User
export async function getUser() {
    return getWrapper({ path: 'users' })
}

export async function deleteUser() {
    return deleteWrapper({ path: 'users' })
}

// Forms
export async function postForm(data: PostFormProps) {
    return postWrapper({ path: 'forms', data })
}

export async function getForms() {
    return getWrapper({ path: 'forms' })
}

export async function getSharedForms() {
    return getWrapper({ path: 'forms/shared' })
}

export async function getForm(formId: string) {
    return getWrapper({ path: `forms/${formId}` })
}

export async function putForm(formId: string, data: PutFormProps) {
    return postWrapper({ path: `forms/${formId}`, data })
}

export async function deleteForm(formId: string) {
    return deleteWrapper({ path: `forms/${formId}` })
}

