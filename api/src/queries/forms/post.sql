-- Create form
INSERT INTO forms (
    user_id,
    title,
    description,
    is_active,
    anonymous_submissions,
    limit,
    published_at,
    expires_at
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
)
RETURNING *;