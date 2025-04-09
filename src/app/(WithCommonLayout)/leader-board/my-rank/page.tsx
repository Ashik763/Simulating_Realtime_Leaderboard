"use client"

import { useEffect, useRef, useState } from "react"
import { Trophy, Medal, Search, ChevronUp, ChevronDown, ArrowUpDown} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react"
import Loading from "@/app/loading"


type formattedLeaderboardData = {
  id: string;
  username: string;
  score: number;
  avatar: string;
}


export default function MyRank() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage] = useState(1)
  const itemsPerPage = 8
  const [leaderboardData, setLeaderboardData] = useState<formattedLeaderboardData[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const { data: session } = useSession();
  const {username, email,id} = session?.user || { username: '', email: '' };
  const [start, setStart] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  

  // Get rank icon based on position
  const getRankIcon = (index: number) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index

    if (sortDirection === "desc") {
      if (actualIndex === 0) return <Trophy className="h-5 w-5 text-yellow-500" />
      if (actualIndex === 1) return <Medal className="h-5 w-5 text-gray-400" />
      if (actualIndex === 2) return <Medal className="h-5 w-5 text-amber-700" />
    }

    return null
  }

  // Get rank number
  const getRankNumber = (index: number) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index
    return actualIndex + 1
  }

  // From Nextjs Server
useEffect(() => {

  if (leaderboardData?.length > 0) return;
    fetch(`/api/game/my-rank/?username=${username}&email=${email}`)
    .then((res) =>res.json())
    .then(data2 => {
      const data = data2.scores;
      console.log(data);
      const {start} = data2;
      setStart(start);
  
      const formattedLeaderboardData = [];

      for(let i=1; i< data?.length; i=i+2){
        const [username, id] = data[i-1].split("|")
        const score = parseInt(data[i]);
        formattedLeaderboardData.push({ id, username, score, avatar: "/placeholder.svg?height=40&width=40" })
      }
      setLeaderboardData(formattedLeaderboardData);
      setLoading(false);
      
      console.log("The length of the redis",data2.size);
      // setLeaderboardData(data);
    }
    )
    .catch((error) => {
      console.error("Error submitting score:", error)
    })
    .finally(() => {
      // setIsSubmitting(false) 
      console.log("Within finally");
  })

},[])



// From WebSocket Server
useEffect(() => {
  if (!socketRef.current) {
    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('🔌 WebSocket connected');
      socket.send(JSON.stringify({ type: 'CLIENT_READY',want:"MY_RANK" , username,email,id }));
      setLoading(false);
    };

    socket.onmessage = (message) => {
      console.log("Received message:", message.data);
      try {
        const parsed = JSON.parse(message.data);
        console.log(parsed);
        if (parsed.type === 'MY_RANK') {
          console.log("Parsed data:", parsed.data);
          const {start} = parsed.data;
          setStart(start);
          setLeaderboardData(parsed.data.scores);
        }
      } catch (err) {
        console.log("Failed to parse WebSocket message:", err);
      }
    };

    socket.onclose = () => console.log('WebSocket disconnected');
    socket.onerror = (err) => console.log('WebSocket error:', err);
  } else {
    // If socket is already connected, just send the new page
    socketRef.current.send(JSON.stringify({ type: 'CLIENT_READY', want:"MY_RANK", username,email,id }));
  }

  // Clean up only once on unmount
  return () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };
}, [email,username,id]); 

if(loading){
  return <Loading></Loading>
}

 return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
       
      <Card className="w-full overflow-hidden border-none bg-white/90 shadow-xl backdrop-blur transition-all">
        <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6" />
            Leaderboard
          </CardTitle>
          <CardDescription className="text-white/90">Top players ranked by score</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search players..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon"  className="flex-shrink-0">
              {sortDirection === "desc" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      Score
                      <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                { leaderboardData?.length > 0 ? (
                  leaderboardData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`
                        ${ (index+start % 2) === 0 ? "bg-white" : "bg-gray-50"}
                        ${getRankNumber(index+start) <= 3 ? "font-medium" : ""}
                        ${username === item.username ? "text-[red]  underline" : ""} }
                      `}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1.5">
                          {getRankIcon(index+start)}
                          <span className={getRankNumber(index+start) <= 3 ? "font-bold" : ""}>{getRankNumber(index+start)}</span>
                        </div>
                      </TableCell>
                      <TableCell className={` 
                          ${username === item.username ? "text-[red]  underline" : ""} }
                        `}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={item.avatar} alt={item.username} />
                            <AvatarFallback>{item.username.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{item.username}</span>
                          {getRankNumber(index+start) <= 3 && (
                            <Badge
                              variant="outline"
                              className={`
                              ml-2 
                              ${
                                getRankNumber(index+start) === 1
                                  ? "border-yellow-500 text-yellow-500"
                                  : getRankNumber(index+start) === 2
                                    ? "border-gray-400 text-gray-500"
                                    : "border-amber-700 text-amber-700"
                              }
                            `}
                            >
                              {getRankNumber(index+start) === 1 ? "Gold" : getRankNumber(index+start) === 2 ? "Silver" : "Bronze"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono font-medium">{item.score.toLocaleString()}</span>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

     
        </CardContent>
      </Card>
    </motion.div>
  )
}

