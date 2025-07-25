CREATE OR REPLACE VIEW vw_best_tracks AS
SELECT
    r.track_id,
    AVG(r.rate) AS average_rating,
    COUNT(r.id) AS review_count
FROM
    reviews r
WHERE
    r.deleted_at IS NULL
GROUP BY
    r.track_id;
