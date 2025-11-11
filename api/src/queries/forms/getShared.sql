-- Get shared forms for user
SELECT f.* FROM forms f
INNER JOIN form_permissions fp ON f.id = fp.form_id
WHERE fp.user_id = $1
ORDER BY f.created_at DESC;