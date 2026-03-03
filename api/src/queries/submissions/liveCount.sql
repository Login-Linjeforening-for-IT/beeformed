SELECT
    (SELECT count(*)::int FROM submissions WHERE form_id = f.id AND status = 'registered') AS registered_count,
    f.limit
FROM forms f
WHERE (f.id::text = $1 OR f.slug = $1)
AND f.published_at < NOW()
AND f.expires_at > NOW();
