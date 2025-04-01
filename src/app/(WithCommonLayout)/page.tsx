import { Header } from "./components/header";
import { GameScoreForm } from "./game-score-form";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <Header></Header>
      <div className="w-full max-w-md">
        <GameScoreForm />
      </div>
    </main>
  )
}

