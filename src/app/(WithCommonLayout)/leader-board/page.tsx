import { LeaderboardTable } from "../leader-board-table";

export default function Leaderboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 py-8">
      <div className="w-full max-w-4xl">
        <LeaderboardTable />
      </div>
    </main>
  )
}

