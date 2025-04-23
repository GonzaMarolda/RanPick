/*
  Warnings:

  - A unique constraint covering the columns `[fatherEntryId]` on the table `Wheel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_nestedWheelId_fkey";

-- DropIndex
DROP INDEX "Entry_nestedWheelId_key";

-- DropIndex
DROP INDEX "Wheel_fatherEntryId_fatherWheelId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Wheel_fatherEntryId_key" ON "Wheel"("fatherEntryId");

-- AddForeignKey
ALTER TABLE "Wheel" ADD CONSTRAINT "Wheel_fatherEntryId_fkey" FOREIGN KEY ("fatherEntryId") REFERENCES "Entry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
