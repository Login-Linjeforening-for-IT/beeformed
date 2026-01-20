-- Create user
INSERT INTO users
(
    user_id,
    email,
    name
)
VALUES (
    $1,
    $2,
    $3
)
ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name
RETURNING *;