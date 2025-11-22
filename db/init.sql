-- Users 
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forms
CREATE TABLE forms (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    anonymous_submissions BOOLEAN DEFAULT FALSE,
    "limit" INTEGER,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form fields
CREATE TABLE form_fields (
    id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
    field_type TEXT NOT NULL,
    label TEXT NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    options JSONB, -- For select/radio/checkbox options: {"choices": ["option1", "option2"]}
    validation JSONB, -- Validation rules: {"min_length": 5, "max_length": 100, "pattern": "regex"}
    field_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form submissions
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(user_id),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submission data
CREATE TABLE submission_data (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
    field_id INTEGER REFERENCES form_fields(id) ON DELETE CASCADE,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form permissions
CREATE TABLE form_permissions (
    id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    "group" TEXT,
    granted_by TEXT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(form_id, user_id, "group")
);

-- Indexes for performance
CREATE INDEX idx_forms_user_id ON forms(user_id);
CREATE INDEX idx_form_fields_form_id ON form_fields(form_id);
CREATE INDEX idx_submissions_form_id ON submissions(form_id);
CREATE INDEX idx_submission_data_submission_id ON submission_data(submission_id);
CREATE INDEX idx_form_permissions_form_id ON form_permissions(form_id);
CREATE INDEX idx_form_permissions_user_id ON form_permissions(user_id);