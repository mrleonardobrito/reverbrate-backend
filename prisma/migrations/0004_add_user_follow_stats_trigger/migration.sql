INSERT INTO user_follow_stats (user_id, followers_count, followees_count)
SELECT id,
    0,
    0
FROM users u
WHERE NOT EXISTS (
        SELECT 1
        FROM user_follow_stats ufs
        WHERE ufs.user_id = u.id
    );
CREATE OR REPLACE FUNCTION create_user_follow_stats() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO user_follow_stats (user_id, followers_count, followees_count)
VALUES (NEW.id, 0, 0);
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_create_user_follow_stats
AFTER
INSERT ON users FOR EACH ROW EXECUTE FUNCTION create_user_follow_stats();