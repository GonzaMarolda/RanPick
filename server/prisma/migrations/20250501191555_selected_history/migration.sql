-- CreateTable
CREATE TABLE "SelectedRecord" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "wheelId" TEXT NOT NULL,

    CONSTRAINT "SelectedRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SelectedRecord" ADD CONSTRAINT "SelectedRecord_wheelId_fkey" FOREIGN KEY ("wheelId") REFERENCES "Wheel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
