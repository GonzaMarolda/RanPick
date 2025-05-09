-- AlterTable
ALTER TABLE "Wheel" ADD COLUMN     "colorPaletteId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Wheel" ADD CONSTRAINT "Wheel_colorPaletteId_fkey" FOREIGN KEY ("colorPaletteId") REFERENCES "ColorPalette"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
