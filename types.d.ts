declare global {
    // Form
    type Form = {
        title: string
        description: string | null
        anonymous_submissions: boolean
        limit: number | null
        published_at: string
        expires_at: string

    }

    type GetFormProps = Form & {
        id: string
        created_at: string
        updated_at: string
    }

    type GetFormsProps = {
        data: GetFormProps[]
        total: number
    }

    type PostFormProps = Form

    type PutFormProps = Form

    type GetPublicFormProps = Form & {
        creator_email: string
        creator_name: string
        fields: {
            id: string
            field_type: string
            title: string
            description: string | null
            required: boolean
            options: string[] | null
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            validation: Record<string, any> | null
            field_order: number
        }[]
    }

    // Feilds
    type FieldProps = {
        form_id: string
        field_type: string
        title: string
        description: string | null
        required: boolean
        options: string[] | null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validation: Record<string, any> | null
        field_order: number
    }

    type GetFieldProps = FieldProps & {
        id: string
        created_at: string
    }

    type GetFieldsProps = GetFieldProps[]

    type PatchFieldsProps = {
        operation: 'create' | 'update' | 'delete'
        id?: number
        data: FieldProps
    }[]

    // Permissions
    type PermissionProps = {
        group: string | null
        user_email: string | null
    }

    type GetPermissionProps = PermissionProps & {
        id: string
        form_id: string
        granted_by_email: string
        created_at: string
        updated_at: string
    }

    type GetPermissionsProps = {
        data: GetPermissionProps[]
        total: number
    }

    type PostPermissionProps = PermissionProps

    // Submissions
    type SubmissionProps = {
        field_id?: number | null
        value?: string | null
    }

    type Submission = {
        id: number
        form_id: number
        form_title: string
        user_email: string | null
        user_name: string | null
        submitted_at: string
        data: SubmissionProps[]
    }

    type GetSubmissionsProps = {
        data: {
            id: number
            form_id: number
            form_title: string
            user_email: string | null
            user_name: string | null
            submitted_at: string
        }[]
        total: number
    }

    type PostSubmissionProps = {
        fields: { field_id: number; value: string }[]
    }
}

export { }