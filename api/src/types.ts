export {}

declare global {
    type SQLParamType = string | number | boolean | null | Date

    interface User {
        user_id: string
        email: string
        name?: string
        created_at: Date
    }
}
