import { prisma } from "@/db/prisma";
import { redis } from "../game/submit/route";

export async function GET() {
  console.log("Syncing leaderboard from Redis to PostgreSQL...");

  const scores = await redis.zrangebyscore("chess_leaderboard", "-inf", "+inf", "WITHSCORES");
  
  for (let i = 0; i < scores.length; i += 2) {
    const [username, userId ] = scores[i].split("|");
    const score = parseInt(scores[i + 1]); 

    await prisma.chessLeaderboard.upsert({
      where: { userId },
      update: { score },
      create: { username,userId, score },
    });
  }

  console.log("Sync complete.");
  return new Response("Leaderboard Synced", { status: 200 });
}
