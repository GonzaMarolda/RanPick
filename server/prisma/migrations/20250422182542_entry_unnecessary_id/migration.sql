/*
  Warnings:

  - A unique constraint covering the columns `[nestedWheelId]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entry_nestedWheelId_key" ON "Entry"("nestedWheelId");
