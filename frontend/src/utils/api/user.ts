'use server'

import apiRequest from './apiWrapper'

export async function getUser() {
    return apiRequest({ method: 'GET', path: 'users' })
}

export async function deleteUser() {
    return apiRequest({ method: 'DELETE', path: 'users' })
}
