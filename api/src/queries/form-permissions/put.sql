-- Update permission
UPDATE form_permissions
SET 
    user_id = $2,
    "group" = $3,
    granted_by = $4,
    updated_at = NOW()
WHERE id = $1
RETURNING *;