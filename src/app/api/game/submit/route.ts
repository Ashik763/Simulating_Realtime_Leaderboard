// import { prisma } from "@/db/prisma"
import { NextResponse } from "next/server";
import Redis from "ioredis";
export const redis = new Redis();



export async function GET(request: Request) {
    const encodedToken = request.headers.get("user-token");

    if (!encodedToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    
      // Decode the base64-encoded token
      const {username} = JSON.parse(Buffer.from(encodedToken, "base64").toString("utf-8"));
      console.log("USERNAME_____:",username);
      console.log(request.url);
      const { searchParams } = new URL(request.url); // Extract query params

      const currentPage =  searchParams.get("currentPage")  ||  1;
      console.log("CURRENT PAGE____:",currentPage);

    try {
        const scores = await redis.zrevrange("chess_leaderboard", (parseInt(currentPage.toString()) -1)*8, Math.min(4, (parseInt(currentPage.toString()))*8), 'WITHSCORES');
        console.log(scores);
        return NextResponse.json(scores, { status: 200 })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
    }


}





// adding score to redis
export async function POST (request: Request){

    const encodedToken = request.headers.get("user-token");

  if (!encodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Decode the base64-encoded token
  const {username,id} = JSON.parse(Buffer.from(encodedToken, "base64").toString("utf-8"));

    try {
        const { game_name, score } = await request.json();

        console.log("Game Name:", game_name);
        // const isFirstTime = await prisma.chess.findFirst({
        //     where: {
             
        //       username: username,
        //     },
        //   });

           await redis.zadd("chess_leaderboard",score, `${username}|${id}`);
          // Adding to postgres 

        //   if(!isFirstTime) {
        //     await prisma.chess.create({
        //         data: {
        //           game_name,
        //           score: 0,
        //           username: username,
        //         },
        //       });
        //     return NextResponse.json({success:true}, { status: 201 })

        //   }

        //  await prisma.chess.update({
        //     where: {
        //         username: username,
        //       },
        //     data: { 
        //       score: { increment: score },
        //      },
        //   })
        return NextResponse.json({success:true}, { status: 201 })
      } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
      }
}