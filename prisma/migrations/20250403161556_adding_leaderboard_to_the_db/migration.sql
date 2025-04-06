-- AlterTable
ALTER TABLE "Chess" ALTER COLUMN "score" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_userId_key" ON "Leaderboard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_username_key" ON "Leaderboard"("username");
