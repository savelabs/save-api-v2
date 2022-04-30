-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "matriculation" TEXT NOT NULL,
    "photoHref" TEXT,
    "lastInfo" JSONB,
    "showNotifications" BOOLEAN NOT NULL DEFAULT false,
    "expoPushTokens" TEXT[],
    "refreshToken" TEXT,
    "lastLogin" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "suapApiToken" TEXT,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
