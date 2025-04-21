/*
  Warnings:

  - A unique constraint covering the columns `[nestedWheelId]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "nestedWheelId" TEXT;

-- AlterTable
ALTER TABLE "Wheel" ADD COLUMN     "fatherEntryId" TEXT,
ADD COLUMN     "fatherWheelId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Entry_nestedWheelId_key" ON "Entry"("nestedWheelId");

-- AddForeignKey
ALTER TABLE "Wheel" ADD CONSTRAINT "Wheel_fatherWheelId_fkey" FOREIGN KEY ("fatherWheelId") REFERENCES "Wheel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_nestedWheelId_fkey" FOREIGN KEY ("nestedWheelId") REFERENCES "Wheel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
