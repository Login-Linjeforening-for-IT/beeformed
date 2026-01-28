-- Get shared forms for user
SELECT f.*, COUNT(*) OVER() as total_count FROM forms f
WHERE EXISTS (
    SELECT 1 FROM form_permissions fp
    WHERE fp.form_id = f.id AND (fp.user_id = $1 OR fp.group = ANY($2))
)
