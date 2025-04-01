import { prisma } from "@/db/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
   

    const user = await prisma.user.findMany();
    console.log(user);

    return NextResponse.json(user);
 
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error,
      }),
      { status: 500 }
    )
  }
}

