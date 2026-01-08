SELECT s.id, s.form_id, s.status, f.expires_at, f."limit", f.title as form_title, s.user_id, f.user_id as form_owner_id
FROM submissions s
JOIN forms f ON s.form_id = f.id
WHERE s.id = $1;
