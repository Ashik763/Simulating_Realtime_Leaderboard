// ws-server.js (or ts)
import { createServer } from "http";
import { WebSocketServer } from "ws";
import Redis from "ioredis";

const server = createServer();
const wss = new WebSocketServer({ server });
const redis = new Redis(); // same Redis instance as your API
const subscriber = new Redis()

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Send initial leaderboard
  async function sendLeaderboard(currentPage=1) {
    try {
    console.log((parseInt(currentPage.toString()) -1)*8,"_______+______", (parseInt(currentPage.toString()))*8);
    const scores = await redis.zrevrange("chess_leaderboard", (parseInt(currentPage.toString()) -1)*8, (parseInt(currentPage.toString()))*8, 'WITHSCORES');

    const formatted = [];

    for (let i = 1; i < scores.length; i += 2) {
      const [username, id] = scores[i - 1].split("|");
      const score = parseInt(scores[i]);
      formatted.push({ id, username, score, avatar: "/placeholder.svg?height=40&width=40" });
    }
    console.log("Formatted data",formatted);

    ws.send(JSON.stringify({ type: "LEADERBOARD_UPDATE", data: formatted }));
  }
  catch(error){
    console.error("Error sending leaderboard:", error);

  }
    
  }



  sendLeaderboard(1);

  
  ws.on("message", async(data) => {
    console.log("WebSocket message received:", data.toString());
    try{
      const parsed = JSON.parse(data.toString());
      const {currentPage} = parsed;
      sendLeaderboard(currentPage)
      
    }
    catch (err) {
      console.error("Failed to process message", err);
    }
  })
 

  // Optionally listen for Redis keyspace events or polling
  // redis.psubscribe("__keyspace@0__:chess_leaderboard");

  ws.on("close", () => console.log("WebSocket disconnected in server"));
});




// eslint-disable-next-line @typescript-eslint/no-explicit-any
function broadcastToAll(data: any) {
    console.log("Number of clients now", wss.clients.size, "clients connected");
    wss.clients.forEach((client) => {
     
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
}



subscriber.subscribe("score_updates", () => {
  console.log("withing subscribe");

    subscriber.on("message", async () => {
      const raw = await redis.zrevrange("chess_leaderboard", 0, 7, "WITHSCORES")
      const formatted = []
  
      for (let i = 1; i < raw.length; i += 2) {
        const [uname, uid] = raw[i - 1].split("|")
        formatted.push({ id: uid, username: uname, score: parseInt(raw[i]), avatar: "/placeholder.svg" })
      }
  
      broadcastToAll({
        type: "LEADERBOARD_UPDATE",
        data: formatted,
      })
    })
  })

server.listen(8080, () => console.log("WebSocket server listening on ws://localhost:8080"));
