-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "matriculation" TEXT NOT NULL,
    "expoPushTokens" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
