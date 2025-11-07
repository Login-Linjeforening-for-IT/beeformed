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
RETURNING *;