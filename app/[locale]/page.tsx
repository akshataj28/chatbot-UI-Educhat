"use client"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { IconArrowRight } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { FC, useContext } from "react"
import { ChatbotUIContext } from "@/context/context"

// const recommendations = [
//   "Recommendation 1",
//   "Recommendation 2",
//   "Recommendation 3",
// ]

export default function HomePage() {
  const { theme } = useTheme()
  const { setUserInput } = useContext(ChatbotUIContext)

  const handleRecommendationClick = (text: string) => {
    setUserInput(text) // Set the recommendation text in the chat input
  }

  return (
    <div className="flex flex-col items-center justify-center size-full">
      <div className="mb-8 flex flex-col items-center">
        {/* Chatbot UI SVG and Title */}
        <div>
          <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} />
        </div>
        <div className="text-4xl font-bold">EDUCHAT</div>

        {/* Start Chatting Button */}
        <Link
          className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold"
          href="/login"
        >
          Start Chatting
          <IconArrowRight className="ml-1" size={20} />
        </Link>
      </div>

      {/* Recommendation Buttons
      <div className="mt-10 flex items-center justify-center "> {}
        {recommendations.map((text, index) => (
          <button
            key={index}
            onClick={() => handleRecommendationClick(text)}
            className="flex items-center justify-center w-[190px] h-[150px] mx-2 rounded-md bg-gray-200 text-center p-4 font-bold hover:bg-gray-300"
          >
            {text}sdfd
          </button>
        ))}
      </div> */}
    </div>
  )
}
