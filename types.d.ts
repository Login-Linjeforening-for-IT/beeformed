type Form = {
    title: string,
    description: string | null,
    is_active: boolean,
    anonymous_submissions: boolean,
    limit: number | null,
    published_at: string | null,
    expires_at: string | null

}

type PostFormProps = Form

type PutFormProps = Form