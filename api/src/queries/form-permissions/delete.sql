-- Delete permission
DELETE FROM form_permissions 
WHERE id = $1 
AND form_id IN (SELECT id FROM forms WHERE user_id = $2);