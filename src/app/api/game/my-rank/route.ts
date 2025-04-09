import { NextResponse } from "next/server";
import Redis from "ioredis";
export const redis = new Redis();




export async function GET(request: Request) {
  try {
    const encodedToken = request.headers.get("user-token");

    if (!encodedToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    
      // Decode the base64-encoded token
      const {username,id} = JSON.parse(Buffer.from(encodedToken, "base64").toString("utf-8"));
      console.log("USERNAME_____:",username);
      console.log(request.url);
      const { searchParams } = new URL(request.url); // Extract query params
      console.log(searchParams);
    //   const currentPage =  searchParams.get("currentPage")  ||  1;
    //   console.log("CURRENT PAGE____:",currentPage);
      // const size = 10;
      const size = await redis.zcard("chess_leaderboard") || 10;
      console.log("Size___________",size);

  
      const rank = await redis.zrevrank("chess_leaderboard", `${username}|${id}`) || 0; 
      const start = Math.max(0, rank-3);
      const end = Math.min(size-1, start+7);
      const scores = await redis.zrevrange("chess_leaderboard", start,end, 'WITHSCORES');
      
      console.log("RANK________:____",rank);
        
        return NextResponse.json({success:true,size,scores,start, end}, { status: 200 })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
    }


}

