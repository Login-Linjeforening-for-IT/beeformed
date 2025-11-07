-- Create form permission
INSERT INTO form_permissions (
    form_id,
    user_id,
    group,
    permission_type,
    granted_by
)
VALUES 
(
    $1,
    $2,
    $3,
    $4,
    $5
)
RETURNING *;