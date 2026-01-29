SELECT count(*)::int as count FROM submissions WHERE form_id = $1 AND status = 'registered';
