-- Update form
UPDATE forms
SET 
    user_id = $2,
    title = $3,
    description = $4,
    is_active = $5,
    anonymous_submissions = $6,
    "limit" = $7,
    published_at = $8,
    expires_at = $9,
    updated_at = NOW()
WHERE id = $1
RETURNING *;