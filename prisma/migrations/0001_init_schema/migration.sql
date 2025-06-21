-- CreateTable
CREATE TABLE "tracks" (
    "id" VARCHAR(50) NOT NULL,
    "isrc_id" VARCHAR(20),
    "name" VARCHAR(200) NOT NULL,
    "artist" VARCHAR(200) NOT NULL,
    "cover_url" TEXT,
    "album" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_track_id_key" ON "reviews"("user_id", "track_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
