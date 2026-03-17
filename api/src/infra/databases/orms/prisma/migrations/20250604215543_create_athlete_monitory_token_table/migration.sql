-- CreateTable
CREATE TABLE "monitory_tokens" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_in" TIMESTAMP(3) NOT NULL,
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "athlete_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitory_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monitory_tokens_uuid_key" ON "monitory_tokens"("uuid");

-- AddForeignKey
ALTER TABLE "monitory_tokens" ADD CONSTRAINT "monitory_tokens_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
