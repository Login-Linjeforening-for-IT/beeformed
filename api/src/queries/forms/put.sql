-- Update form
UPDATE forms
SET 
    title = $2,
    description = $3,
    anonymous_submissions = $4,
    "limit" = $5,
    published_at = $6,
    expires_at = $7,
    updated_at = NOW()
WHERE id = $1
RETURNING *;