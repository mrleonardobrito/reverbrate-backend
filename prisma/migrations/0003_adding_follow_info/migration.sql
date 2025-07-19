-- CreateTable
CREATE TABLE "follows" (
    "follower_id" TEXT NOT NULL,
    "followee_id" TEXT NOT NULL,
    "followed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_id","followee_id")
);

-- CreateTable
CREATE TABLE "user_follow_stats" (
    "user_id" TEXT NOT NULL,
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "followees_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_follow_stats_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "idx_follows_follower" ON "follows"("follower_id");

-- CreateIndex
CREATE INDEX "idx_follows_followee" ON "follows"("followee_id");

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "fk_follows_follower" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "fk_follows_followee" FOREIGN KEY ("followee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow_stats" ADD CONSTRAINT "user_follow_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_follow_stats SET followees_count = followees_count + 1 WHERE user_id = NEW.follower_id;
    UPDATE user_follow_stats SET followers_count = followers_count + 1 WHERE user_id = NEW.followee_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_follow_stats SET followees_count = followees_count - 1 WHERE user_id = OLD.follower_id;
    UPDATE user_follow_stats SET followers_count = followers_count - 1 WHERE user_id = OLD.followee_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trg_follow_counts
AFTER INSERT OR DELETE ON follows
FOR EACH ROW
EXECUTE FUNCTION update_follow_counts();
