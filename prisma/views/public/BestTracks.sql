SELECT
  r.track_id,
  avg(r.rate) AS average_rating,
  count(r.id) AS review_count
FROM
  reviews r
WHERE
  (r.deleted_at IS NULL)
GROUP BY
  r.track_id;