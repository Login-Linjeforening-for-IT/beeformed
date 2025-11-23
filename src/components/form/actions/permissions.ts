'use server'

import { postPermission } from '@utils/api'
import {
    getOptionalString
} from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostPermissionProps



function extractPermissionProps(formData: FormData): PostPermissionProps {
    return {
        user_email : getOptionalString(formData, 'user_email'),
        group : getOptionalString(formData, 'group'),
    }
}

export async function updatePermission(_: PostFormState, formData: FormData, formId: string): Promise<PostFormState> {
    try {
        const props = extractPermissionProps(formData)

        if (!props.user_email && !props.group) {
            return 'At least one of user_email or group must be defined'
        }

        const response = await postPermission(formId, props)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}