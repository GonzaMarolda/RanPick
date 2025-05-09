-- CreateTable
CREATE TABLE "ColorPalette" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "colors" TEXT[],

    CONSTRAINT "ColorPalette_pkey" PRIMARY KEY ("id")
);
