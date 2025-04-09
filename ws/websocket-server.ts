// ws-server.js (or ts)
import { createServer } from "http";
import { WebSocketServer } from "ws";
import Redis from "ioredis";

const server = createServer();
const wss = new WebSocketServer({ server });
const redis = new Redis(); // same Redis instance as your API
const subscriber = new Redis()

type TParsedData  = {
  want: string;
  type: string;
  username: string;
  id: string;

}
const clients = new Map(); // username|id -> WebSocket

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Send initial leaderboard
  async function sendLeaderboard(currentPage=1) {
    try {
    //console.log((parseInt(currentPage.toString()) -1)*8,"_______+______", (parseInt(currentPage.toString()))*8);
    const scores = await redis.zrevrange("chess_leaderboard", (parseInt(currentPage.toString()) -1)*8, (parseInt(currentPage.toString()))*8, 'WITHSCORES');

    const formatted = [];

    for (let i = 1; i < scores.length; i += 2) {
      const [username, id] = scores[i - 1].split("|");
      const score = parseInt(scores[i]);
      formatted.push({ id, username, score, avatar: "/placeholder.svg?height=40&width=40" });
    }
    //console.log("Formatted data",formatted);

    ws.send(JSON.stringify({ type: "LEADERBOARD_UPDATE", data: formatted }));
  }
  catch(error){
    console.error("Error sending leaderboard:", error);

  }
    
  }
  async function getMyRank(parsed:TParsedData ){
    
    if(parsed.want === "MY_RANK"){
      const {username,id} = parsed;
      //console.log("USERNAME_____:",username);
      //console.log("ID_____:",id);

      const rank = await redis.zrevrank("chess_leaderboard", `${username}|${id}`) || 0; 
      const size = await redis.zcard("chess_leaderboard") || 10;
      const start = Math.max(0, rank-3);
      const end = Math.min(size-1, start+7);
      const scores = await redis.zrevrange("chess_leaderboard", start,end, 'WITHSCORES');
      const formatted = [];

      for (let i = 1; i < scores.length; i += 2) {
        const [username, id] = scores[i - 1].split("|");
        const score = parseInt(scores[i]);
        formatted.push({ id, username, score, avatar: "/placeholder.svg?height=40&width=40" });
      }
    //console.log("Formatted data",formatted);
      
      //console.log("RANK________:____",rank);
        ws.send(JSON.stringify({type:"MY_RANK",data:{rank,size,start, end,scores:formatted }}))
    }
  }

  

  // sendLeaderboard(1);


  
  ws.on("message", async(data) => {
    //console.log("WebSocket message received:", data.toString());

    try{

      
      const parsed = JSON.parse(data.toString());
      console.log("Parsed data",parsed);

      if(parsed.want === "MY_RANK"){
        const {username,id} = parsed;
        clients.set(`${username}|${id}`, ws);
        getMyRank(parsed);
      }
      // else if (parsed.type === "subscribe") {
      //   const {username} = parsed;
      //   clients.set(username, ws);
      //   console.log(`${username} subscribed to rank updates`);
      // }
      else{

        const {currentPage} = parsed;
        sendLeaderboard(currentPage)
      }
      
    }
    catch (err) {
      console.error("Failed to process message", err);
    }
  })
 

  ws.on("close", () => {
    console.log("WebSocket connection closed");
   
      for (const [username, socket] of clients.entries()) {
        if (socket === ws) clients.delete(username);
      }
    });
});


export async function broadcastRankWindows() {
  for (const [usernameWithId, ws] of clients.entries()) {
    const [username, id] = usernameWithId.split("|");

    const rank = await redis.zrevrank("chess_leaderboard", `${username}|${id}`) || 0; 
    const size = await redis.zcard("chess_leaderboard") || 10;
    const start = Math.max(0, rank-3);
    const end = Math.min(size-1, start+7);
    const scores = await redis.zrevrange("chess_leaderboard", start,end, 'WITHSCORES');
    const formatted = [];

    for (let i = 1; i < scores.length; i += 2) {
      const [username, id] = scores[i - 1].split("|");
      const score = parseInt(scores[i]);
      formatted.push({ id, username, score, avatar: "/placeholder.svg?height=40&width=40" });
    }

    if(ws.readyState === ws.OPEN )  ws.send(JSON.stringify({type:"MY_RANK",data:{rank,size,start, end,scores:formatted }}));
  }
}



    // const rank = await redis.zrevrank("leaderboard", username);
    // if (rank === null) continue;

    // const scores = await redis.zrevrange(
    //   "chess_leaderboard",
    //   Math.max(rank - 3, 0),
    //   Math.min(rank + 3,50),
    //   "WITHSCORES"
    // );
    // const formatted = [];

    //   for (let i = 1; i < scores.length; i += 2) {
    //     const [username, id] = scores[i - 1].split("|");
    //     const score = parseInt(scores[i]);
    //     formatted.push({ id, username, score, avatar: "/placeholder.svg?height=40&width=40" });
    //   }

    //     ws.send(JSON.stringify({type:"MY_RANK",data:{rank,start, end,scores:formatted }}))

    // const payload = JSON.stringify({
    //   type: "MY_RANK",
    //   username,
    //   rank,
    //   window,
    // });




// eslint-disable-next-line @typescript-eslint/no-explicit-any
function broadcastToAll(data: any) {
    //console.log("Number of clients now", wss.clients.size, "clients connected");
    wss.clients.forEach((client) => {
     
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
}

// Web socket broadcast to all e change korte hobe! 0,7 is a bokachoda way

subscriber.subscribe("score_updates", () => {
  console.log("withing subscribe");

    subscriber.on("message", async () => {
      const raw = await redis.zrevrange("chess_leaderboard", 0, 7, "WITHSCORES")
      const formatted = []
  
      for (let i = 1; i < raw.length; i += 2) {
        const [username, uid] = raw[i - 1].split("|")
        formatted.push({ id: uid, username: username, score: parseInt(raw[i]), avatar: "/placeholder.svg" })
      }
  
      broadcastToAll({
        type: "LEADERBOARD_UPDATE",
        data: formatted,
      })


      broadcastRankWindows();
    })
  })




server.listen(8080, () => console.log("WebSocket server listening on ws://localhost:8080"));
