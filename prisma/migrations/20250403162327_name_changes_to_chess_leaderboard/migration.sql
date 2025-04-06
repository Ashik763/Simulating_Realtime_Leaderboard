/*
  Warnings:

  - You are about to drop the `Leaderboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Leaderboard";

-- CreateTable
CREATE TABLE "ChessLeaderboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "ChessLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChessLeaderboard_userId_key" ON "ChessLeaderboard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChessLeaderboard_username_key" ON "ChessLeaderboard"("username");
