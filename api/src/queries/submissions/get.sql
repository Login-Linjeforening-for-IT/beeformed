SELECT s.id, s.form_id, f.title as form_title, u.email as user_email, u.name as user_name, s.submitted_at,
    COALESCE(json_agg(json_build_object('field_id', sd.field_id, 'value', sd.value)) FILTER (WHERE sd.field_id IS NOT NULL), '[]'::json) as data
FROM submissions s
LEFT JOIN users u ON s.user_id = u.user_id
LEFT JOIN forms f ON s.form_id = f.id
LEFT JOIN submission_data sd ON s.id = sd.submission_id
WHERE s.id = $1 AND (s.user_id = $2 OR f.user_id = $2)
GROUP BY s.id, f.title, u.email, u.name