-- Update form field
UPDATE form_fields
SET 
    field_type = $2,
    label = $3,
    placeholder = $4,
    required = $5,
    options = $6,
    validation = $7,
    field_order = $8
WHERE 
    id = $1
RETURNING *;