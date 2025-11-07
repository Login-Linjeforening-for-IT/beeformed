-- Get forms by user ID
SELECT * FROM forms WHERE user_id = $1 ORDER BY created_at DESC;