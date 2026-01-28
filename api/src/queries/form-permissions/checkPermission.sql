-- Check if user has permission to access a form
SELECT EXISTS(
    SELECT 1 FROM form_permissions
    WHERE form_id = $1 AND (user_id = $2 OR "group" = ANY($3))
) OR EXISTS(
    SELECT 1 FROM forms
    WHERE id = $1 AND user_id = $2
) AS has_permission;
