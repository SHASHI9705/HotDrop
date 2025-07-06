-- CreateTable
CREATE TABLE "Shopimage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,

    CONSTRAINT "Shopimage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shopimage_partnerId_key" ON "Shopimage"("partnerId");

-- AddForeignKey
ALTER TABLE "Shopimage" ADD CONSTRAINT "Shopimage_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
