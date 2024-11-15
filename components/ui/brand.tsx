"use client"

import Link from "next/link"
import { FC } from "react"
import { ChatbotUISVG } from "../icons/chatbotui-svg"
import {Robot} from "../Shapes/robot.js"

interface BrandProps {
  theme?: string
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <Link
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      href="https://www.chatbotui.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* Wrapper div to adjust position */}
      <div className="flex flex-col items-center -mt-[260px]"> {/* Maintain flex-col here */}
        {/* New div to align icon and text horizontally */}
        <div className="flex items-center space-x-8">
          <Robot theme={theme === "dark" ? "dark" : theme === "beige" ? "beige" : "light" } height={100} width={100} scale={0.9} />
          <div className="text-4xl font-bold tracking-wide mt-4">EDUCHAT</div> {/* Removed mt-4 since it's now aligned horizontally */}
        </div>
      </div>
    </Link>
  )
}
