CREATE TYPE "list_type" AS ENUM ('album', 'artist', 'track');
CREATE TABLE "lists" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "type" "list_type" NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "lists_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "list_items" (
    "id" TEXT NOT NULL,
    "list_id" VARCHAR(50) NOT NULL,
    "item_id" VARCHAR(50) NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "list_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "list_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "list_items_unique_position" UNIQUE ("list_id", "position"),
    CONSTRAINT "list_items_unique_item" UNIQUE ("list_id", "item_id")
);
CREATE UNIQUE INDEX "list_items_list_id_position_key" ON "list_items"("list_id", "position");
CREATE UNIQUE INDEX "list_items_list_id_item_id_key" ON "list_items"("list_id", "item_id");