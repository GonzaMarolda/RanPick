-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_wheelId_fkey";

-- DropForeignKey
ALTER TABLE "Wheel" DROP CONSTRAINT "Wheel_fatherEntryId_fkey";

-- DropForeignKey
ALTER TABLE "Wheel" DROP CONSTRAINT "Wheel_fatherWheelId_fkey";

-- AddForeignKey
ALTER TABLE "Wheel" ADD CONSTRAINT "Wheel_fatherWheelId_fkey" FOREIGN KEY ("fatherWheelId") REFERENCES "Wheel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wheel" ADD CONSTRAINT "Wheel_fatherEntryId_fkey" FOREIGN KEY ("fatherEntryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_wheelId_fkey" FOREIGN KEY ("wheelId") REFERENCES "Wheel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
