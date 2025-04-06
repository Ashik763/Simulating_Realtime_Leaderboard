import { redis } from '@/app/api/game/submit/route';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

async function main() {
  console.log("Seeding users and leaderboard...");

  const plainPassword = '123456';
  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  for (let i = 1; i <= 50; i++) {
    const username = `user${i}`;
    const email = `user${i}@example.com`;
    const score = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        username,
        email,
        password: hashedPassword,
      },
    });

     await redis.zadd("chess_leaderboard",score, `${username}|${user.id}`);

    // await prisma.chessLeaderboard.upsert({
    //   where: { userId: user.id },
    //   update: {
    //     score,
    //   },
    //   create: {
    //     userId: user.id,
    //     username: user.username,
    //     score,
    //   },
    // });
  }

  console.log("✅ Done seeding 50 users!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
