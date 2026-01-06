-- Create form
INSERT INTO forms (
    user_id,
    slug,
    title,
    description,
    anonymous_submissions,
    "limit",
    published_at,
    expires_at
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8
)
RETURNING *;