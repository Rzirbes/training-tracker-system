-- CreateTable
CREATE TABLE "states" (
    "id" INTEGER NOT NULL,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "uf" VARCHAR(4) NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" INTEGER NOT NULL,
    "uuid" UUID NOT NULL,
    "state_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "slug" VARCHAR(150),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "states_uuid_key" ON "states"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "cities_uuid_key" ON "cities"("uuid");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
