'use server'

import {
    postWrapper,
    getWrapper,
    deleteWrapper,
} from './apiWrapper'

// User
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createUser(data: any) {
    return postWrapper({ path: 'users', data })
}

export async function getUser() {
    return getWrapper({ path: 'users' })
}

export async function deleteUser() {
    return deleteWrapper({ path: 'users' })
}