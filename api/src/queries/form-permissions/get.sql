-- Get all permissions for a specific form
SELECT * FROM form_permissions
WHERE form_id = $1;