-- Update form
UPDATE forms
SET 
    slug = $2,
    title = $3,
    description = $4,
    anonymous_submissions = $5,
    "limit" = $6,
    waitlist = $7,
    published_at = $8,
    expires_at = $9,
    updated_at = NOW()
WHERE id = $1
RETURNING *;