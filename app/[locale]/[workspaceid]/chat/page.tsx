"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { ChatUI } from "@/components/chat/chat-ui"
import { QuickSettings } from "@/components/chat/quick-settings"
import { Brand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useTheme } from "next-themes"
import { useContext, useState } from "react"
import { IconStar, IconStarFilled } from "@tabler/icons-react"
// import "../../globals.css"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages, setUserInput, userInput } = useContext(ChatbotUIContext)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const { theme } = useTheme()
  console.log("theme from page", theme)
  // State to manage favorite chats
  // const [favoriteChats, setFavoriteChats] = useState<string[]>([])

  // // State to toggle whether the current chat is favorited
  // const [isFavorited, setIsFavorited] = useState<boolean>(false)

  // // Function to handle adding/removing a chat to/from favorites
  // const toggleFavorite = () => {
  //   if (isFavorited) {
  //     setFavoriteChats(favoriteChats.filter(chat => chat !== userInput))
  //   } else {
  //     setFavoriteChats([...favoriteChats, userInput])
  //   }
  //   setIsFavorited(!isFavorited)
  // }

  const handlePromptClick = (prompt: string) => {
    setUserInput(userInput + prompt) // Add the selected prompt to the input
    handleFocusChatInput() // Focus on the input field after adding the prompt
  }

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
          <Brand theme={theme} />
          </div>

          {/* Quick settings and chat settings */}
          {/* <div className="absolute left-2 top-2">
            <QuickSettings />
          </div> */}
          <div className="absolute right-2 top-2">
            <ChatSettings />
          </div>

          {/* Favorite icon button */}
          {/* <div className="absolute top-2 right-12 cursor-pointer">
            {isFavorited ? (
              <IconStarFilled
                className="text-yellow-500"
                size={28}
                onClick={toggleFavorite}
              />
            ) : (
              <IconStar
                className="text-gray-400 hover:text-yellow-500"
                size={28}
                onClick={toggleFavorite}
              />
            )}
          </div> */}

         {/* Recommended prompt buttons */}
{/* Recommended prompt buttons */}
<div className="absolute left-0 right-0 top-1/3 mx-auto flex justify-center space-x-1 gap-40 mt-9">
  <button
    className={`flex h-[180px] w-[230px] btn-${theme} items-center justify-center rounded-md`}
    onClick={() => handlePromptClick("Recommended  1")}
  >
    Recommended 1
  </button>
  <button
    className={`flex h-[180px] w-[230px] items-center justify-center rounded-md btn-${theme}`}
    onClick={() => handlePromptClick("Recommended  2")}
  >
    Recommended 2
  </button>
  <button
    className={`flex h-[180px] w-[230px] items-center justify-center rounded-md btn-${theme}`}
    onClick={() => handlePromptClick("Recommended  3")}
  >
    Recommended 3
  </button>
</div>



          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>

          {/* <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div> */}
        </div>
      ) : (
        <ChatUI chat={{
            assistant_id: null,
            context_length: 0,
            created_at: "",
            embeddings_provider: "",
            folder_id: null,
            id: "",
            include_profile_context: false,
            include_workspace_instructions: false,
            model: "",
            name: "",
            prompt: "",
            sharing: "",
            temperature: 0,
            updated_at: null,
            user_id: "",
            workspace_id: ""
          }} />
      )}
    </>
  )
}
