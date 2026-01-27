UPDATE submissions
SET scanned_at = NOW()
WHERE id = $1
RETURNING scanned_at;
