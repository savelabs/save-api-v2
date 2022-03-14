-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "matriculation" TEXT NOT NULL,
    "photoHref" TEXT,
    "expoPushTokens" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
