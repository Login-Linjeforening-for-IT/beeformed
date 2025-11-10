'use server'

import {
    getWrapper,
    deleteWrapper,
} from './apiWrapper'

// User
export async function getUser() {
    return getWrapper({ path: 'users' })
}

export async function deleteUser() {
    return deleteWrapper({ path: 'users' })
}