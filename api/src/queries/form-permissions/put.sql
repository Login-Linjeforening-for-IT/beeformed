-- Update permission
UPDATE form_permissions
SET 
    user_id = $2,
    group = $3,
    permission_type = $4,
    granted_by = $5
WHERE id = $1
RETURNING *;