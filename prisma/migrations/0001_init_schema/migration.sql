-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(5) NOT NULL DEFAULT generate_alphanumeric_id(),
    "nickname" VARCHAR(200) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "bio" TEXT,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "track_id" VARCHAR(50) NOT NULL,
    "rate" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "reviews_user_id_track_id_key" ON "reviews"("user_id", "track_id");
CREATE INDEX users_nickname_id_idx ON users (nickname, id);
-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");