-- CreateTable
CREATE TABLE "Unsubscribes" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unsubscribes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unsubscribes_uuid_key" ON "Unsubscribes"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Unsubscribes_email_key" ON "Unsubscribes"("email");
