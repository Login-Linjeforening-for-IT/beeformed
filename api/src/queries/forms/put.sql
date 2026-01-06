-- Update form
UPDATE forms
SET 
    slug = $2,
    title = $3,
    description = $4,
    anonymous_submissions = $5,
    "limit" = $6,
    published_at = $7,
    expires_at = $8,
    updated_at = NOW()
WHERE id = $1
RETURNING *;