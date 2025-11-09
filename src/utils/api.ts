'use server'

import {
    postWrapper,
    getWrapper,
    patchWrapper,
    deleteWrapper,
} from "./apiWrapper";

// User
export async function createUser(data: any) {
    return postWrapper({ path: 'users', data })
}

export async function getUser() {
    return getWrapper({ path: `users` })
}

export async function deleteUser() {
    return deleteWrapper({ path: `users` })
}