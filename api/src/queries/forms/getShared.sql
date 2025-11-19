-- Get shared forms for user
SELECT f.*, COUNT(*) OVER() as total_count FROM forms f
INNER JOIN form_permissions fp ON f.id = fp.form_id
WHERE fp.user_id = $1