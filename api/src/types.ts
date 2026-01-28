export {}

declare global {
    type SQLParamType = string | number | boolean | null | Date | string[]

    interface User {
        user_id: string
        email: string
        name?: string
        created_at: Date
    }

    interface Form {
        id: number
        user_id: string
        slug: string
        title: string
        description?: string
        anonymous_submissions: boolean
        limit?: number
        waitlist: boolean
        published_at: Date
        expires_at: Date
        created_at: Date
        updated_at: Date
    }

    interface FormField {
        id: number
        form_id: number
        field_type: string
        label: string
        placeholder?: string
        required: boolean
        options?: string[]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validation?: any
        field_order: number
        created_at: Date
    }

    interface FormPermission {
        id: number
        form_id: number
        user_id: string
        group?: string
        permission_type: string
        granted_by: string
        created_at: Date
        updated_at: Date
    }

    interface Submission {
        id: string
        form_id: number
        user_id?: string
        submitted_at: Date
        // field_id/value can be NULL in db, reflect that in types
        data?: { field_id: number | null; value: string | null }[]
    }
}
