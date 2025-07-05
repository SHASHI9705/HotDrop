/*
  Warnings:

  - A unique constraint covering the columns `[shopname]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Partner_shopname_key" ON "Partner"("shopname");
