-- Update form field
UPDATE form_fields
SET 
    field_type = $2,
    label = $3,
    required = $4,
    options = $5,
    validation = $6,
    field_order = $7
WHERE 
    id = $1
RETURNING *;