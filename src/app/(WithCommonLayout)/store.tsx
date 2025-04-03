"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal, Search, ChevronUp, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// const leaderboardData = [
//   { id: 1, username: "GrandMaster42", score: 9875, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 2, username: "ChessWizard", score: 9720, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 3, username: "QueenGambit", score: 9650, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 4, username: "StrategicMind", score: 9320, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 5, username: "PuzzleSolver", score: 9180, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 6, username: "KnightRider", score: 8950, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 7, username: "BishopMoves", score: 8820, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 8, username: "RookMaster", score: 8750, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 9, username: "PawnPusher", score: 8600, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 10, username: "CheckmatePro", score: 8520, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 11, username: "SudokuKing", score: 8450, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 12, username: "PuzzleQueen", score: 8320, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 13, username: "GameMaster", score: 8250, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 14, username: "MindBender", score: 8120, avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 15, username: "LogicWizard", score: 8050, avatar: "/placeholder.svg?height=40&width=40" },
// ]
type formattedLeaderboardData = {
  id: string;
  username: string;
  score: number;
  avatar: string;
}
export function LeaderboardTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const [leaderboardData, setLeaderboardData] = useState<formattedLeaderboardData[]>([]);

  // Filter and sort the data
  const filteredData = leaderboardData.filter((item) => item.username.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedData = [...filteredData].sort((a, b) => {
    return sortDirection === "desc" ? b.score - a.score : a.score - b.score
  })

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "desc" ? "asc" : "desc")
  }

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

  useEffect(() => {
      fetch("/api/game/submit")
      .then((res) =>res.json())
      .then(data => {

        console.log(data)
        // const formattedLeaderboardData = [];

        // for(let i=1; i< data?.length; i=i+2){
        //   const [username, id] = data[i-1].split("|")
        //   const score = parseInt(data[i]);
        //   formattedLeaderboardData.push({ id, username, score, avatar: "/placeholder.svg?height=40&width=40" })
        // }
        // setLeaderboardData(formattedLeaderboardData);
        setLeaderboardData(data);
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
            <Button variant="outline" size="icon" onClick={toggleSortDirection} className="flex-shrink-0">
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
                      <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer" onClick={toggleSortDirection} />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        ${getRankNumber(index) <= 3 ? "font-medium" : ""}
                      `}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1.5">
                          {getRankIcon(index)}
                          <span className={getRankNumber(index) <= 3 ? "font-bold" : ""}>{getRankNumber(index)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={item.avatar} alt={item.username} />
                            <AvatarFallback>{item.username.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{item.username}</span>
                          {getRankNumber(index) <= 3 && (
                            <Badge
                              variant="outline"
                              className={`
                              ml-2 
                              ${
                                getRankNumber(index) === 1
                                  ? "border-yellow-500 text-yellow-500"
                                  : getRankNumber(index) === 2
                                    ? "border-gray-400 text-gray-500"
                                    : "border-amber-700 text-amber-700"
                              }
                            `}
                            >
                              {getRankNumber(index) === 1 ? "Gold" : getRankNumber(index) === 2 ? "Silver" : "Bronze"}
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

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} players
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                  let pageNumber: number

                  if (totalPages <= 3) {
                    pageNumber = i + 1
                  } else if (currentPage === 1) {
                    pageNumber = i + 1
                  } else if (currentPage === totalPages) {
                    pageNumber = totalPages - 2 + i
                  } else {
                    pageNumber = currentPage - 1 + i
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className="h-8 w-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

