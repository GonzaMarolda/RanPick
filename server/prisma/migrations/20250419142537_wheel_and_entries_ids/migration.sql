/*
  Warnings:

  - The primary key for the `Entry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Wheel` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_wheelId_fkey";

-- AlterTable
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "wheelId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Entry_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Entry_id_seq";

-- AlterTable
ALTER TABLE "Wheel" DROP CONSTRAINT "Wheel_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Wheel_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Wheel_id_seq";

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_wheelId_fkey" FOREIGN KEY ("wheelId") REFERENCES "Wheel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
