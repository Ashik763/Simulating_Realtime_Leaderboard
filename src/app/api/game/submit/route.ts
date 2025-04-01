import { prisma } from "@/db/prisma"
import { NextResponse } from "next/server"





export async function POST (request: Request){

    const encodedToken = request.headers.get("user-token");

  if (!encodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Decode the base64-encoded token
  const {username} = JSON.parse(Buffer.from(encodedToken, "base64").toString("utf-8"));

    try {
        const { game_name, score } = await request.json();
        console.log("Game Name:", game_name);
        const isFirstTime = await prisma.chess.findFirst({
            where: {
             
              username: username,
            },
          });

          if(!isFirstTime) {
            await prisma.chess.create({
                data: {
                  game_name: "first",
                  score: 0,
                  username: username,
                },
              });
            return NextResponse.json({success:true}, { status: 201 })

          }

         await prisma.chess.update({
            where: {
                username: username,
              },
            data: { game_name, score },
          })
        return NextResponse.json({success:true}, { status: 201 })
      } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
      }
}