import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { IconHeart, IconInfoCircle, IconMessagePlus, IconShare } from "@tabler/icons-react"
import { FC, useContext, useEffect, useState } from "react"
import { WithTooltip } from "../ui/with-tooltip"
import { StarIcon,  } from "lucide-react"
import  FilledStarIcon from "@/components/Shapes/FilledStarIcon.js"
import {updateFavoriteStatus} from "@/db/chats"
interface ChatSecondaryButtonsProps {}

export const ChatSecondaryButtons: FC<ChatSecondaryButtonsProps> = ({}) => {
  const { selectedChat, setChats } = useContext(ChatbotUIContext)
  const { handleNewChat } = useChatHandler()
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    // Load favorite status from localStorage if it exists
    if (selectedChat) {
      const favoritedChats = JSON.parse(localStorage.getItem("favoritedChats") || "{}")
      setIsFavorited(favoritedChats[selectedChat.id] || false)
    }
  }, [selectedChat])

  // const toggleFavorite = () => {
  //   const newFavoriteStatus = !isFavorited
  //   setIsFavorited(newFavoriteStatus)

  //   if (selectedChat) {
  //     // Update the selected chat's favorited status in context
  //     setChats((chats) =>
  //       chats.map((chat) =>
  //         chat.id === selectedChat.id
  //           ? { ...chat, isFavorited: newFavoriteStatus }
  //           : chat
  //       )
  //     )

  //     // Save the updated favorited status in localStorage
  //     const favoritedChats = JSON.parse(localStorage.getItem("favoritedChats") || "{}")
  //     favoritedChats[selectedChat.id] = newFavoriteStatus
  //     localStorage.setItem("favoritedChats", JSON.stringify(favoritedChats))
  //   }
  // }
  const toggleFavorite = async () => {
    const newFavoriteStatus = !isFavorited
    setIsFavorited(newFavoriteStatus)
  
    if (selectedChat) {
      // Update the selected chat's favorited status in context
      setChats((chats) =>
        chats.map((chat) =>
          chat.id === selectedChat.id
            ? { ...chat, isFavorited: newFavoriteStatus }
            : chat
        )
      )
  
      // Update the favorite status in the database
      await updateFavoriteStatus(selectedChat.id, newFavoriteStatus)
    }
  }
  
  const handleShare = () => {
    // Implement your share logic here
    console.log("Share button clicked")
  }
  return (
    <>
      {selectedChat && (
        <>
          {/* <WithTooltip
            delayDuration={200}
            display={
              <div>
                <div className="text-xl font-bold">Chat Info</div>

                <div className="mx-auto mt-2 max-w-xs space-y-2 sm:max-w-sm md:max-w-md lg:max-w-lg">
                  <div>Model: {selectedChat.model}</div>
                  <div>Prompt: {selectedChat.prompt}</div>

                  <div>Temperature: {selectedChat.temperature}</div>
                  <div>Context Length: {selectedChat.context_length}</div>

                  <div>
                    Profile Context:{" "}
                    {selectedChat.include_profile_context
                      ? "Enabled"
                      : "Disabled"}
                  </div>
                  <div>
                    {" "}
                    Workspace Instructions:{" "}
                    {selectedChat.include_workspace_instructions
                      ? "Enabled"
                      : "Disabled"}
                  </div>

                  <div>
                    Embeddings Provider: {selectedChat.embeddings_provider}
                  </div>
                </div>
              </div>
            }
            trigger={
              <div className="mt-1">
                <IconInfoCircle
                  className="cursor-default hover:opacity-50"
                  size={24}
                />
              </div>
            }
          /> */}

          {/* <WithTooltip
            delayDuration={200}
            display={<div>Start a new chat</div>}
            trigger={
              <div className="mt-1">
                <IconMessagePlus
                  className="cursor-pointer hover:opacity-50"
                  size={24}
                  onClick={handleNewChat}
                />
              </div>
            }
          /> */}

          <WithTooltip
            delayDuration={200}
            display={<div>{isFavorited ? "UnStar" : "Star"}</div>}
            trigger={
              <div className="mt-1">
                {isFavorited ? (
                  <FilledStarIcon
                    className="cursor-pointer text-white-500 hover:opacity-50"
                    size={24}
                    onClick={toggleFavorite}
                  />
                ) : (
                  <StarIcon
                    className="cursor-pointer hover:opacity-50"
                    size={24}
                    onClick={toggleFavorite}
                  />
                )}
              </div>
            }
          />

<WithTooltip
            delayDuration={200}
            display={<div>Share Chat</div>}
            trigger={
              <div className="mt-1">
                <IconShare
                  className="cursor-pointer hover:opacity-50"
                  size={24}
                  onClick={handleShare}
                />
              </div>
            }
          />

           {/* <WithTooltip
            delayDuration={200}
            display={<div>{isFavorited ? "Unfavorite Chat" : "Favorite Chat"}</div>}
            trigger={
              <div className="mt-1">
                {isFavorited ? (
                  <IconHeartFilled
                    className="cursor-pointer text-red-500 hover:opacity-50"
                    size={24}
                    onClick={() => toggleFavoriteChat(selectedChat.id)}
                  />
                ) : (
                  <IconHeart
                    className="cursor-pointer hover:opacity-50"
                    size={24}
                    onClick={() => toggleFavoriteChat(selectedChat.id)}
                  />
                )}
              </div>
            }
          /> */}
        </>
      )}
    </>
  )
}
