-- Update form
UPDATE forms
SET 
    title = $2,
    description = $3,
    is_active = $4,
    anonymous_submissions = $5,
    "limit" = $6,
    published_at = $7,
    expires_at = $8,
    updated_at = NOW()
WHERE id = $1
RETURNING *;