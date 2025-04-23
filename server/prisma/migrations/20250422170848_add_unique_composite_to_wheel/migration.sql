/*
  Warnings:

  - A unique constraint covering the columns `[fatherEntryId,fatherWheelId]` on the table `Wheel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wheel_fatherEntryId_fatherWheelId_key" ON "Wheel"("fatherEntryId", "fatherWheelId");
