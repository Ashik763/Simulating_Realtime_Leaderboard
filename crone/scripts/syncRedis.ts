import cron from "node-cron";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const redis = new Redis(); // ioredis instance

async function syncRedisToPostgres() {
  console.log("Syncing leaderboard from Redis to PostgreSQL...");

  const scores = await redis.zrangebyscore("chess_leaderboard", "-inf", "+inf", "WITHSCORES");
  
  for (let i = 0; i < scores.length; i += 2) {
    const [username, userId ] = scores[i].split("|");
    const score = parseInt(scores[i + 1]); 

    await prisma.chessLeaderboard.upsert({
      where: { userId },
      update: { score },
      create: { username, userId, score },
    });
  }

  console.log("Sync complete.");
}

// Schedule the job to run every 5 minutes
cron.schedule("*/5 * * * *", () => {
  syncRedisToPostgres();
});

console.log("Cron job scheduled: Sync Redis to PostgreSQL every 5 minutes.");
