SELECT
    f.*,
    u.name as creator_name,
    u.email as creator_email,
    COALESCE(json_agg(
        jsonb_build_object(
            'id', ff.id,
            'field_type', ff.field_type,
            'title', ff.title,
            'description', ff.description,
            'required', ff.required,
            'options', ff.options,
            'validation', ff.validation,
            'field_order', ff.field_order
        ) ORDER BY ff.field_order
    ) FILTER (WHERE ff.id IS NOT NULL), '[]'::json) as fields
FROM forms f
LEFT JOIN users u ON f.user_id = u.user_id
LEFT JOIN form_fields ff ON f.id = ff.form_id
WHERE (f.id::text = $1 OR f.slug = $1)
AND f.published_at < NOW()
AND f.expires_at > NOW()
GROUP BY f.id, u.name, u.email;