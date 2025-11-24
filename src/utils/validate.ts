export function getRequiredString(formData: FormData, key: string): string {
    const value = formData.get(key)
    if (value === null || value === '' || value === undefined) throw new Error(`${key} is required`)
    return value as string
}

export function getOptionalString(formData: FormData, key: string): string | null {
    const value = formData.get(key)
    if (value === null || value === '' || value === undefined) return null
    return value as string
}

export function getRequiredNumber(formData: FormData, key: string): number {
    const value = formData.get(key)
    if (value === null || value === '' || value === undefined) throw new Error(`${key} is required`)
    const num = Number(value)
    if (isNaN(num)) throw new Error(`${key} must be a number`)
    return num
}

export function getOptionalNumber(formData: FormData, key: string): number | null {
    const value = formData.get(key)
    if (value === null || value === '' || value === undefined) return null
    const num = Number(value)
    return isNaN(num) ? null : num
}

export function getBoolean(formData: FormData, key: string): boolean {
    const value = formData.get(key)
    if (value === null || value === '' || value === undefined) return false
    if (value === 'true' || value === 'on') return true
    if (value === 'false') return false
    return false
}

export function getRequiredDateTime(formData: FormData, key: string): string {
    const date = formData.get(key)
    if (date) {
        return `${date}`
    }
    throw new Error(`${key} is required`)
}

export function getOptionalDateTime(formData: FormData, key: string): string | null {
    const date = formData.get(key)
    if (date) {
        return `${date}`
    }
    return null
}

export function getRequiredDate(formData: FormData, key: string): string {
    const value = formData.get(key)
    if (value === null || value === '' || value === undefined) throw new Error(`${key} is required`)
    return value as string
}

export function getOptionalArray(formData: FormData, key: string): string[] | null {
    const value = formData.get(key) as string || ''
    const array = value.split(',').map(s => s.trim()).filter(s => s !== '')
    return array.length > 0 ? array : null
}

export function getRequiredJSON(formData: FormData, key: string): object {
    const value = formData.get(key)
    if (value === null || value === '' || value === undefined) throw new Error(`${key} is required`)
    try {
        return JSON.parse(value as string)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new Error(`${key} must be valid JSON`)
    }
}

export function validateData(data: unknown): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data !== null && data !== undefined && !('error' in (data as any))
}