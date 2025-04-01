"use client"

import { useState } from "react"
import { Trophy } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { cookies } from "next/headers"

const formSchema = z.object({
  game_name: z.string({
    required_error: "Please select a game",
  }),
  score: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({
        required_error: "Please enter a score",
        invalid_type_error: "Score must be a number",
      })
      .min(0, "Score must be at least 0")
      .max(10000, "Score cannot exceed 10000"),
  ),
})

type FormValues = z.infer<typeof formSchema>

export function GameScoreForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      game_name: "",
      score: 0,
    },
  })

  function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    console.log(data);
    fetch("/api/game/submit",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res)
        if (res.ok) {
          setSubmitted(true)
          form.reset()
        } else {
          console.error("Failed to submit score")
        }
      })
      .catch((error) => {
        console.error("Error submitting score:", error)
      })
      .finally(() => {
        setIsSubmitting(false)
    })
  
  }

  if (submitted) {
    return (
      <Card className="w-full overflow-hidden border-none bg-white/90 shadow-xl backdrop-blur transition-all">
        <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6" />
            Score Submitted!
          </CardTitle>
          <CardDescription className="text-white/90">Your game score has been recorded</CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="mb-4 text-lg font-medium">Thank you for submitting your score!</p>
          <Button
            onClick={() => {
              form.reset()
              setSubmitted(false)
            }}
            className="mt-2"
          >
            Submit Another Score
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden border-none bg-white/90 shadow-xl backdrop-blur transition-all">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Trophy className="h-6 w-6" />
          Game Score
        </CardTitle>
        <CardDescription className="text-white/90">Record your latest gaming achievement</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="game_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a game" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="chess">Chess</SelectItem>
                      <SelectItem value="sudoku">Sudoku</SelectItem>
                      <SelectItem value="puzzle">Puzzle</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the game you played</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your score"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? "" : value)
                      }}
                    />
                  </FormControl>
                  <FormDescription>Enter your final score</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Score"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <p className="text-xs text-gray-500">Your scores are saved for leaderboard rankings and personal statistics.</p>
      </CardFooter>
    </Card>
  )
}

