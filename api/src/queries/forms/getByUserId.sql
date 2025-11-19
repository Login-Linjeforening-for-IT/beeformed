-- Get forms by user ID
SELECT *, COUNT(*) OVER() as total_count FROM forms WHERE user_id = $1