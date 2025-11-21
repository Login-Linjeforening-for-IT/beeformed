type Form = {
    title: string,
    description: string | null,
    is_active: boolean,
    anonymous_submissions: boolean,
    limit: number | null,
    published_at: string | null,
    expires_at: string | null

}

type GetFormProps = Form & {
    id: string
    created_at: string,
    updated_at: string
}

type GetFormsProps = {
    data: GetFormProps[],
    total: number
}

type PostFormProps = Form

type PutFormProps = Form